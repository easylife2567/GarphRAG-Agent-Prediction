import { defineStore } from 'pinia';

export const useSimulationStore = defineStore('simulation', {
    state: () => ({
        currentSimulationId: null as string | null,
        simulationData: null as any,
        simulationStatus: 'not_started', // not_started, preparing, ready, running, completed, error

        currentReportId: null as string | null,
        reportData: null as any,
        reportStatus: 'not_started', // not_started, generating, completed, error
    }),

    actions: {
        reset() {
            this.currentSimulationId = null;
            this.simulationData = null;
            this.simulationStatus = 'not_started';
            this.currentReportId = null;
            this.reportData = null;
            this.reportStatus = 'not_started';
        },

        setSimulationData(id: string | null, data: any) {
            this.currentSimulationId = id;
            if (data) {
                this.simulationData = data;
                if (data.status) this.simulationStatus = data.status;
            }
        },

        setSimulationId(id: string | null) {
            this.currentSimulationId = id;
        },

        setSimulationStatus(status: string) {
            this.simulationStatus = status;
        },

        setReportData(id: string | null, data: any) {
            this.currentReportId = id;
            if (data) {
                this.reportData = data;
                if (data.status) this.reportStatus = data.status;
            }
        },

        setReportId(id: string | null) {
            this.currentReportId = id;
        },

        setReportStatus(status: string) {
            this.reportStatus = status;
        },
    },
});
