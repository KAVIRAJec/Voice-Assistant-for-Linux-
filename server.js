const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const app = express();
const port = 3005;

app.use(cors());

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

app.all('/openCalculator', (req, res) => {
    if (req.method === 'POST' || req.method === 'GET') {
        exec('sudo gnome-calculator', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error opening calculator: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                res.status(500).json({ error: 'Unable to open the calculator.' });
                return;
            }
            console.log(`Calculator opened: ${stdout}`);
            res.json({ message: 'Opening Calculator.' });
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.all('/openCalender', (req, res) => {
    if (req.method === 'POST' || req.method === 'GET') {
        exec('sudo gnome-calendar', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error opening calendar: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                res.status(500).json({ error: 'Unable to open the calendar.' });
                return;
            }
            console.log(`calendar opened: ${stdout}`);
            res.json({ message: 'Opening calendar.' });
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.all('/openSettings', (req, res) => {
    if (req.method === 'POST' || req.method === 'GET') {
        exec('sudo gnome-control-center', (error, stdout, stderr) => {
            console.log(`settings opened: ${stdout}`);
            res.json({ message: 'Opening settings' });
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.all('/openWhatsapp', (req, res) => {
    if (req.method === 'POST' || req.method === 'GET') {
        exec('/snap/bin/whatsapp-for-linux', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error opening WhatsApp: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                res.status(500).json({ error: 'Unable to open WhatsApp.' });
                return;
            }
            console.log(`WhatsApp opened: ${stdout}`);
            res.json({ message: 'Opening WhatsApp' });
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.all('/openVSCode', (req, res) => {
    if (req.method === 'POST' || req.method === 'GET') {
        // Specify the user data directory
        const userDataDir = path.join(os.tmpdir(), 'vscode_user_data');

        // Use --no-sandbox and --user-data-dir arguments
        const command = `code --no-sandbox --user-data-dir=${userDataDir}`;

        // Use the exec function to execute the command and handle the response
        exec(command, (error, stdout, stderr) => {
            console.log(`VS Code opened: ${stdout}`);
            res.json({ message: 'Opening VS Code.' });
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
