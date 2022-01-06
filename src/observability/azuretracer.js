"use strict";
const _ = require("lodash");
let appInsights = require("applicationinsights");
const TracerBase = require("moleculer").TracerExporters.Base;

class AppInsightsTracingExporter extends TracerBase {
	constructor(opts) {
		super(opts);

		this.opts = _.defaultsDeep(this.opts, {
			appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
		});
	}

	init() {
		if (typeof this.opts.appInsightsKey === "undefined"){		
			console.log("The 'APPINSIGHTS_INSTRUMENTATIONKEY' env variable is missing!");
		}
		try {
			appInsights
				.setup(this.opts.appInsightsKey) 
				.setAutoDependencyCorrelation(this.opts.autoDependencyCorrelation || true )
				.setAutoCollectRequests(this.opts.autoCollectRequests || true )
				.setAutoCollectPerformance(this.opts.autoCollectPerformanceValue || true, this.opts.autoCollectPerformanceExtended || false) 
				.setAutoCollectExceptions(this.opts.autoCollectRequests || true )
				.setAutoCollectDependencies(this.opts.autoCollectDependencies || true )
				.setAutoCollectConsole(this.opts.autoCollectConsole || true )
				.setInternalLogging(this.opts.debugging || false,this.opts.warning || true)
				.setUseDiskRetryCaching(this.opts.ueDiskRetryCaching || true )
				.setSendLiveMetrics(this.opts.sendLiveMetrics || false );
			appInsights.start();

			this.client = new appInsights.TelemetryClient(this.opts.appInsightsKey);
			this.client.context.tags[
				appInsights.TelemetryClient(this.opts.appInsightsKey).context.keys.cloudRole
			] = this.nodeInstanceName;
		} catch (err) {
			// TODO log properly here
			console.log(
				"The 'applicationinsights' package is missing! Please install it with 'npm install applicationinsights --save' command!"
			);
		}
	}

	spanFinished(span) {
		// console.log(span);

		if (span.error) {
			this.client.trackException({ exception: span }); // This will propagation of the error all the way up
		}

		this.client.trackRequest({ name: span.name, url: `${span.tags.nodeID}.${span.service.name}`, duration: span.duration, resultCode: !span.error ? 200 : span.error.code, success: !span.error });
		this.client.flush();

	}
	stop(){
		this.client.flush();
	}
}

module.exports = AppInsightsTracingExporter; 