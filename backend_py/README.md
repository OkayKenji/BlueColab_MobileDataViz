# AquaWatch Mobile Backend

This folder contains the various files related to the backend.

## Tech Stack
-   Languages
    -   [Python 🔗](https://www.python.org/)
-   UI Components
    -   [Shiny 🔗](https://shiny.posit.co/py/)
-   Deploy
    -   [Shiny Apps IO 🔗](https://www.shinyapps.io/)

## Prerequisites
 - [git 🔗](https://git-scm.com/) - version control. For installing git, please see the [git website 🔗](https://git-scm.com/).
 - [Python 3.11.x 🔗](https://www.python.org/) - language. For installing Python 3.11.x, please see the [here 🔗](https://www.python.org/downloads/release/python-3119/). When installing Python, make sure to check "Add python.EXE to PATH".
 - [VS Code](https://code.visualstudio.com/) with [Shiny](https://marketplace.visualstudio.com/items?itemName=Posit.shiny) Extension.

## Getting Started
1. Open a terminal in this directory ``../BlueColab_MobileDataViz/backend_py/``
2. Run ``pip install -r requirements.txt``, it installs all needed python packages. If the former does not work, please manually run the following:
   1. ``pip install dataretrieval``
   2. ``pip install pandas``
   3. ``pip install plotly``
   4. ``pip install rsconnect_python``
   5. ``pip install shiny``
   6. ``pip install shinywidgets``
Use caution: manually installing packages can cause version-conflict issues. 

## Running locally on computer
1. Using VS Code with Shiny is the easiest way to run. 
2. Open app.py and click the the Run (Play) Button at the top.
3. A side panel should pop up.

## Running locally on mobile device (unofficial)
1. Run the runner.py file.
2. In the terminal, the following should appear: `Your Shiny Python should be served on http://xxx.xxx.xxx:9999`. 
3. Go to the website on your phone.
4. Note that as this is unofficial not all devices may support this. Generally your computer and phone must be on same network. Firewalls may present issues as well. 
5. As an alternative, most browsers support [device mode testing](https://developer.chrome.com/docs/devtools/device-mode). 

## Deploying to Dev (https://aquawatchmobile.shinyapps.io/aquawatchmobiledev/)
1. Deployment is handled by [GitHub Actions](https://docs.github.com/en/actions).
2. To deploy to dev, first make your chances on a branch called `backend-dev`.
3. Test locally.
4. Open a PR.
5. If all checks are successful, you will see the updated backend here: https://aquawatchmobile.shinyapps.io/aquawatchmobiledev/

To edit the workflow and it's triggers edit: [.github/workflows/dev_backend_delploy.yml](../.github/workflows/dev_backend_delploy.yml)

## Deploying to Production (https://aquawatchmobile.shinyapps.io/aquawatchmobilepy/)
1. Deployment is handled by [GitHub Actions](https://docs.github.com/en/actions).
2. To deploy to dev follow the above dev deploy checks.
3. Verify dev website works as intended.
4. Approve and merge PR containing the updates.

To edit the workflow and it's triggers edit: [.github/workflows/backend_delploy.yml](../.github/workflows/backend_delploy.yml)
