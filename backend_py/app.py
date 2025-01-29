from shiny.express import input, render, ui, session
from shiny import reactive
from urllib.parse import urlparse, parse_qs
from shinywidgets import render_plotly
from data_fetch import fetch_data_caller
from helper_functions import get_years, generate_line_graph
import calendar, datetime
import pandas as pd
import plotly.graph_objects as go
from pathlib import Path

ui.include_css(
    Path(__file__).parent / "loader.css"
)
ui.HTML('<div id="yo" class="load1"><div class="loader">Loading...</div></div>')

@render.text
def output_text_verbatim():
    """Creates the title above the graph

    Returns:
        str: Title to be set
    """
    parameter = input.parameter()
    location_1 = input.location_1()
    location_2 = input.location_2()
    month_1 = input.month_1()
    month_2 = input.month_2()
    year_1 = input.year_1()
    year_2 = input.year_2()

    if (location_2 != "NA" and month_2!="NA" and year_2!="NA" ):
        return f"{parameter} data for {location_1} in {month_1} {year_1} and  {location_2} in {month_2} {year_2}"
    else:
        return f"{parameter} data for {location_1} in {month_1} {year_1}"
    
def create_empty_plot():
    # Create an empty Plotly figure
    fig = go.Figure()
    return fig

hidden = 'hidden'
# mix, avg and min for parameters with shades
# units with parameters
with ui.layout_columns():

    @render_plotly
    def plot1():
        parameter = input.parameter()
        location_1 = input.location_1()
        location_2 = input.location_2()
        month_1 = input.month_1()
        month_2 = input.month_2()
        year_1 = input.year_1()
        year_2 = input.year_2()

        # Hi Lizi! Could you adjust plot1() and plot2(), so instead of having the code below this
        # it instead calls generate_line_graph(parameter, location_1, month_1, year_1)
        # you would have to adjust parameter names etc. 

        df = fetch_data_caller(location_1, year_1, month_1).data

        full_to_short_names = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct',
                            'Salinity': 'Sal', 'Temperature': 'Temp', 'Turbidity': 'Turb', 'pH': 'pH'}
        
        try:
            df_param_only = df[["timestamp", full_to_short_names[parameter]]]
        except KeyError as e:
            print(f"KeyError: {e} was raised. This column does not exist.!?")
            return create_empty_plot()
        
        if parameter == 'Temperature':
            df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

        df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])
        # print(df_param_only)
        df_daily_summary = df_param_only.resample('D', on='timestamp').agg(
            min_value=(full_to_short_names[parameter], 'min'),
            max_value=(full_to_short_names[parameter], 'max'),
            avg_value=(full_to_short_names[parameter], 'mean')
        ).reset_index()

        if df_daily_summary.empty:
            return None

        fig = go.Figure()

        fig.add_trace(go.Scatter(
            x=df_daily_summary['timestamp'].tolist() + df_daily_summary['timestamp'].tolist()[::-1],
            y=df_daily_summary['max_value'].tolist() + df_daily_summary['min_value'].tolist()[::-1],
            fill='toself',
            fillcolor='rgba(0, 100, 255, 0.4)',
            line=dict(color='rgba(0, 0, 255, 0)'),
            hoverinfo='skip'
        ))

        fig.add_trace(go.Scatter(
            x=df_daily_summary['timestamp'],
            y=df_daily_summary['avg_value'],
            mode='lines',
            line=dict(color='darkblue', width = 3),
            hovertemplate='<b>Date:</b> %{x}<br>' +
                        '<b>Average:</b> %{y}<br>' +
                        '<b>Max:</b> %{customdata[0]}<br>' +
                        '<b>Min:</b> %{customdata[1]}',
            customdata=df_daily_summary[['max_value', 'min_value']],
            name = parameter
        ))

        y_axis_title = {
            'Conductivity': 'Conductivity  (mS/cm)',
            'Dissolved Oxygen': 'Dissolved Oxygen  (%)',
            'Salinity': 'Salinity  (ppt)',
            'Temperature': 'Temperature  (°F)',
            'Turbidity': 'Turbidity  (NTU)',
            'pH': 'pH'
        }

        fig.update_layout(yaxis_title=y_axis_title[parameter], height=250, showlegend=False)

        # So like in the end, you could do something lik3
        # return generate_line_graph(parameter, location_1, month_1, year_1); 
        # we want to do this, so we repeat less of the same code
        # and easier to fix bugs 
        return fig 

    @render_plotly
    def plot2():
        parameter = input.parameter()
        location_1 = input.location_1()
        location_2 = input.location_2()
        month_1 = input.month_1()
        month_2 = input.month_2()
        year_1 = input.year_1()
        year_2 = input.year_2()

        # Hi Lizi! Could you adjust plot1() and plot2(), so instead of having the code below this
        # it instead calls generate_line_graph(parameter, location_1, month_1, year_1)
        # you would have to adjust parameter names etc. 

        if (location_2 != "NA" and month_2!="NA" and year_2!="NA" ):
            df = fetch_data_caller(location_2, year_2, month_2).data
            full_to_short_names = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct',
                            'Salinity': 'Sal', 'Temperature': 'Temp', 'Turbidity': 'Turb', 'pH': 'pH'}

            try:
                df_param_only = df[["timestamp", full_to_short_names[parameter]]]
            except KeyError as e:
                print(f"KeyError: {e} was raised. This column does not exist.")
                return create_empty_plot()            
            if parameter == 'Temperature':
                df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

            df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])
            # print(df_param_only)
            df_daily_summary = df_param_only.resample('D', on='timestamp').agg(
                min_value=(full_to_short_names[parameter], 'min'),
                max_value=(full_to_short_names[parameter], 'max'),
                avg_value=(full_to_short_names[parameter], 'mean')
            ).reset_index()

            if df_daily_summary.empty:
                return None

            fig = go.Figure()

            fig.add_trace(go.Scatter(
                x=df_daily_summary['timestamp'].tolist() + df_daily_summary['timestamp'].tolist()[::-1],
                y=df_daily_summary['max_value'].tolist() + df_daily_summary['min_value'].tolist()[::-1],
                fill='toself',
                fillcolor='rgba(0, 100, 255, 0.4)',
                line=dict(color='rgba(0, 0, 255, 0)'),
                hoverinfo='skip'
            ))

            fig.add_trace(go.Scatter(
                x=df_daily_summary['timestamp'],
                y=df_daily_summary['avg_value'],
                mode='lines',
                line=dict(color='darkblue', width = 3),
                hovertemplate='<b>Date:</b> %{x}<br>' +
                            '<b>Average:</b> %{y}<br>' +
                            '<b>Max:</b> %{customdata[0]}<br>' +
                            '<b>Min:</b> %{customdata[1]}',
                customdata=df_daily_summary[['max_value', 'min_value']],
                name = parameter
            ))

            y_axis_title = {
                'Conductivity': 'Conductivity  (mS/cm)',
                'Dissolved Oxygen': 'Dissolved Oxygen  (%)',
                'Salinity': 'Salinity  (ppt)',
                'Temperature': 'Temperature  (°F)',
                'Turbidity': 'Turbidity  (NTU)',
                'pH': 'pH'
            }

            fig.update_layout(yaxis_title=y_axis_title[parameter], height=250, showlegend=False)

            return fig
        else:
            return None

        
# @render.text
# def parameter_summary1():
#     parameter = input.parameter()
#     location_1 = input.location_1()
#     location_2 = input.location_2()
#     month_1 = input.month_1()
#     month_2 = input.month_2()
#     year_1 = input.year_1()
#     year_2 = input.year_2()

#     df = fetch_data_caller(location_1, year_1, month_1).data

#     full_to_short_names = {'Conductivity': 'Cond', 'Dissolved Oxygen': 'DOpct',
#                            'Salinity': 'Sal', 'Temperature': 'Temp', 'Turbidity': 'Turb', 'pH': 'pH'}
#     df_param_only = df[["timestamp", full_to_short_names[parameter]]]

#     if parameter == 'Temperature':
#         df_param_only[full_to_short_names[parameter]] = (df_param_only[full_to_short_names[parameter]] * 9/5) + 32

#     df_param_only['timestamp'] = pd.to_datetime(df_param_only['timestamp'])
#     df_daily_summary = df_param_only.resample('D', on='timestamp').agg(
#         min_value=(full_to_short_names[parameter], 'min'),
#         max_value=(full_to_short_names[parameter], 'max'),
#         avg_value=(full_to_short_names[parameter], 'mean')
#     ).reset_index()

#     if df_daily_summary.empty:
#         return f"No data available for {parameter} at {location_1} for the selected period."

#     min_val = df_daily_summary['min_value'].min()
#     max_val = df_daily_summary['max_value'].max()
#     avg_val = df_daily_summary['avg_value'].mean()

#     return f"{parameter} at {location_1} for {month_1} {year_1}: Min: {int(min_val)} Avg: {int(avg_val)} Max: {int(max_val)}"

with ui.layout_columns():
    @render_plotly
    def plot3():
        parameter = input.parameter()
        location_1 = input.location_1()
        location_2 = input.location_2()
        month_1 = input.month_1()
        month_2 = input.month_2()
        year_1 = input.year_1()
        year_2 = input.year_2()
        wqi = None

        # So like the same with plot1,2 could move the code
        # below into helper_functions.py please for plot3 and plot4?
        # remember to do the imports like on line 6

        if location_1 == "Choate Pond":
            wqi = fetch_data_caller(location_1, year_1, month_1).wqi

        if wqi is not None:
            fig = go.Figure()
            fig.update_layout(height=300,margin=dict(l=40, r=40)) 
            fig.add_trace(go.Indicator(
                mode="gauge+number",
                value=wqi,
                title = f"WQI {location_1} {month_1} {year_1}",
                domain={'x': [0, 1], 'y': [0.0, 1]},
                gauge={
                    'axis': {'range': [None, 100]},
                    'steps': [
                        {'range': [0, 25], 'color': "darkred"},
                        {'range': [25, 50], 'color': "darkorange"},
                        {'range': [50, 70], 'color': "yellow"},
                        {'range': [70, 90], 'color': "green"},
                        {'range': [90, 100], 'color': "darkgreen"}],
                    'threshold': {
                        'line': {'color': "white", 'width': 4},
                        'thickness': 0.75,
                        'value': wqi},
                    'bar': {'color': 'white', 'thickness': 0.4}
                }
            ))  
            return fig
        else:
            return None   

    @render_plotly
    def plot4():
        parameter = input.parameter()
        location_1 = input.location_1()
        location_2 = input.location_2()
        month_1 = input.month_1()
        month_2 = input.month_2()
        year_1 = input.year_1()
        year_2 = input.year_2()
        wqi = None

        if location_2 == "Choate Pond":
            wqi = fetch_data_caller(location_2, year_2, month_2).wqi

        if wqi is not None:
            fig = go.Figure()
            fig.update_layout(height=300, margin=dict(l=40, r=40)) 
            fig.add_trace(go.Indicator(
                mode="gauge+number",
                value=wqi,
                title = f"WQI {location_2} {month_2} {year_2}",
                domain={'x': [0, 1.0], 'y': [0.0, 1.00]},
                gauge={
                    'axis': {'range': [None, 100]},
                    'steps': [
                        {'range': [0, 25], 'color': "darkred"},
                        {'range': [25, 50], 'color': "darkorange"},
                        {'range': [50, 70], 'color': "yellow"},
                        {'range': [70, 90], 'color': "green"},
                        {'range': [90, 100], 'color': "darkgreen"}],
                    'threshold': {
                        'line': {'color': "white", 'width': 4},
                        'thickness': 0.75,
                        'value': wqi},
                    'bar': {'color': 'white', 'thickness': 0.4}
                }
            ))
            return fig
        else:
            return None

# Creation of down drop to get the water parameters
ui.input_selectize(
    "parameter", "Select parameter:",
    choices=["Temperature","Conductivity", "Dissolved Oxygen","Salinity","Turbidity","pH"]
)

# Creation of dropdowns to get current years
# Get locations
with ui.layout_columns():
    ui.input_select("location_1", "Location 1", choices=["Choate Pond", "Yonkers","West Point","Poughkeepsie"], width="100%")
    ui.input_select("location_2", "Location 2", choices=["NA","Choate Pond", "Yonkers","West Point","Poughkeepsie"], width="100%")

# Get month, by default the first drop down is set to the last month
with ui.layout_columns():
    ui.input_select("month_1", "Month 1", choices=["January", "February","March","April","May","June","July","August","September","October","November","December"], width="100%",selected=calendar.month_name[datetime.datetime.now().month - 1 if datetime.datetime.now().month > 1 else 12])
    ui.input_select("month_2", "Month 2", choices=["NA","January", "February","March","April","May","June","July","August","September","October","November","December"], width="100%")

# Get year, by default the first drop down is set to the last month's year
with ui.layout_columns():
    ui.input_select("year_1", "Year 1", choices=get_years(), width="100%", selected=datetime.datetime.now().year if datetime.datetime.now().month > 1 else datetime.datetime.now().year - 1)
    ui.input_select("year_2", "Year 2", choices=get_years(show_na=True), width="100%")

# @render.ui
# def result():
#     search = urlparse(session.input[".clientdata_url_search"]())
#     query_params = parse_qs(search.query)
#     # print( query_params['defaultLocation'][0] )
#     hidden = "shown"
#     return "lol"
