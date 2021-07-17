const express = require('express');
const app = express();
const DeviceDetector = require('node-device-detector');
const expressLayouts = require('express-ejs-layouts');
const DeviceHelper = require('node-device-detector/helper');

// Vew Engine Setup
app.set('view engine', 'ejs');
app.use(expressLayouts);

// create middleware
const middlewareDetect = (req, res, next) => {
	const detector = new DeviceDetector();
	const userAgent = req.headers['user-agent'];
	const result = detector.detect(userAgent);
	const { client } = result;
	req.deviceInfo = result;

	if (client.type === 'browser') next();
	else res.status(403).end();
};

// Routes Setup
app.get('/', middlewareDetect, (req, res) => {
	data = {
		clientInfo: req.deviceInfo.client,
		os: req.deviceInfo.os,
	};

	if (DeviceHelper.isDesktop(req.deviceInfo)) {
		res.render('index', { layout: 'layouts/desktop', deviceType: 'Desktop', ...data });
	} else if (DeviceHelper.isMobile(req.deviceInfo)) {
		res.render('index', { layout: 'layouts/mobile', deviceType: 'Mobile', ...data });
	} else {
		res.send('This service is not available on your device');
	}
});

app.get('/about', middlewareDetect, (req, res) => {
	const nodeVersion = process.versions.node;
	if (DeviceHelper.isDesktop(req.deviceInfo)) {
		res.render('about', { layout: 'layouts/desktop', deviceType: 'Desktop', nodeVersion });
	} else if (DeviceHelper.isMobile(req.deviceInfo)) {
		res.render('about', { layout: 'layouts/mobile', deviceType: 'Mobile', nodeVersion });
	} else {
		res.send('This service is not available on your device');
	}
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
