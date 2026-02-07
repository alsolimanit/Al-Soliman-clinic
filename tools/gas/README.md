Steps to deploy the Google Apps Script from this repository using clasp

Prerequisites
- Install Node.js and npm
- Install clasp globally: `npm install -g @google/clasp`

Quick deploy
1. Login with clasp: `clasp login`
2. Update `.clasp.json` at repo root: replace `ENTER_YOUR_SCRIPT_ID_HERE` with your existing script ID, or leave it and run `clasp create --type webapp --title "Clinic API" --rootDir tools/gas` to create a new project.
3. Push the code: `clasp push`
4. Create a deployment (web app): `clasp deploy --description "Deploy from repo"`
5. In the Apps Script console, set the deployment access (Execute as: Me, Who has access: Anyone) if prompted. Copy the exec URL and paste it into your app or share it here.

Notes
- If you create a new script with `clasp create`, it will return a `scriptId` — paste that into `.clasp.json` so subsequent `clasp push` works.
- After deployment, test: `curl 'PASTE_EXEC_URL?debug=1'` or from PowerShell use `Invoke-RestMethod`.
