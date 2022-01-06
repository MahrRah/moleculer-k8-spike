"use strict";
const _ = require("lodash");
let appInsights = require("applicationinsights");
const TracerBase = require("moleculer").TracerExporters.Base;

const APP_NAME = "Molecular-Test-App";

class AppInsightsTracingExporter extends TracerBase {
	constructor({ appName = APP_NAME }) {
		super();
		this.appName = appName;
		console.log("Initialized");
	}

	init() {
		try {
			appInsights
				.setup() // Key is places in  
				.setAutoDependencyCorrelation(true)
				.setAutoCollectRequests(true)
				.setAutoCollectPerformance(true, true)
				.setAutoCollectExceptions(true)
				.setAutoCollectDependencies(true)
				.setAutoCollectConsole(true)
				.setUseDiskRetryCaching(true)
				.setSendLiveMetrics(true);

			appInsights.start();
			this.client = new appInsights.TelemetryClient();
			this.client.context.tags[
				appInsights.TelemetryClient().context.keys.cloudRole
			] = this.appName;
		} catch (err) {
			// TODO log properly here
			console.log(
				"The 'applicationinsights' package is missing! Please install it with 'npm install applicationinsights --save' command!"
			);
		}
	}

	spanFinished(span) {
		console.log(span);
		this.client.trackRequest({ name: span.name, url: span.service.name, duration: span.duration, resultCode: !span.error ? 200 : span.error.code, success: !span.error });
		this.client.flush();
	
	}
}

module.exports = AppInsightsTracingExporter; 