var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport(({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: 'cloudlockteam@gmail.com',
		password: 'Cloudlock2018',
		clientId: '101078704079-crdg67cs8spa3o39oklh7rnhmnc8h9ld.apps.googleusercontent.com',
		clientSecret: '_Xt5hzqdjgpg8K5hKWya9iaf',
		refreshToken: '1/8e2AiYapzIGROPGNrIHqIkyYMo2VYPf8zvK_fUzwgQ8',
		accessToken: 'ya29.GlswBgBoYNe3E5wQETMAfcVPtSXhUP77uoStICIeU2op3BkuJZtBSeynVDy9a6aQQwYhkbqXvKI7O3uV7b3YL9mc2xCxowHQHFOy5i_SM-TXmRPf1kEWK0LcRSCE'
	}
}));

var mailOptions = {
	from: 'CloudLock Team <cloudlockteam@gmail.com>',
	to: 'bochita01@gmail.com',
	subject: 'Nodemailer Test',
	text: 'Buenas!'
}

transporter.sendMail(mailOptions, function(err, res){
	if (err){
		console.log('Error: ' + err);
	}
	else {
		console.log('Email sent');
	}
})