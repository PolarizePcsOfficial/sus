const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = response.data.ip;

        fs.readFile(path.join(__dirname, '../ips.json'), (err, data) => {
            let ips = [];
            if (!err) {
                ips = JSON.parse(data);
            }
            ips.push({ ip: ipAddress, date: new Date() });

            fs.writeFile(path.join(__dirname, '../ips.json'), JSON.stringify(ips, null, 2), (err) => {
                if (err) {
                    console.error('Error saving IP address:', err);
                    return res.status(500).send('Error saving IP address.');
                }
                res.json({ ip: ipAddress });
            });
        });
    } catch (error) {
        console.error('Error fetching public IP address:', error);
        res.status(500).send('Error fetching IP address.');
    }
};
