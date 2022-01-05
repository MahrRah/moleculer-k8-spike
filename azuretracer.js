"use strict";
const _ = require("lodash");
let appInsights = require("applicationinsights");
const TracerBase = require("moleculer").TracerExporters.Base;
const KEY = "366c2f8e-0957-459c-a7ef-ba0deffd4909";
const APP_NAME = "Molecular-Test-App";

class AppInsightsTracingExporter extends TracerBase {
	constructor({ appName = APP_NAME }) {
		super();
		this.appName = appName;
	}

	init() {
		try {
			appInsights
				.setup(KEY) // Needs to be placed in 
				.setAutoDependencyCorrelation(true)
				.setAutoCollectRequests(true)
				.setAutoCollectPerformance(true, true)
				.setAutoCollectExceptions(true)
				.setAutoCollectDependencies(true)
				.setAutoCollectConsole(true)
				.setUseDiskRetryCaching(true)
				.setSendLiveMetrics(true);

			appInsights.start();
			this.client = new appInsights.TelemetryClient(KEY);
			this.client.context.tags[
				appInsights.TelemetryClient(KEY).context.keys.cloudRole
			] = this.appName;
		} catch (err) {
			this.tracer.broker.fatal(
				"The 'applicationinsights' package is missing! Please install it with 'npm install applicationinsights --save' command!",
				err,
				true
			);
		}
	}

	spanFinished(span) {
		console.log(span);
		this.client.trackRequest({ name: span.name, url: span.service.name, duration: span.duration, resultCode: 200, success: true });

		// this.client.trackRequest({
		// 	name: "molecular" + span.name,
		// 	url: "",
		// 	duration: span.duration,
		// 	resultCode: span.error == null ? 200 : span.error.code,
		// 	success: span.error == null ? true: false,
		// });
		this.client.flush();
	}
}

module.exports = AppInsightsTracingExporter;