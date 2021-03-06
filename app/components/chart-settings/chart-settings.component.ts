import { Component, Input, OnInit } from "@angular/core";
import { NbaApiService } from "src/app/services/nba-api.services";
import { TeamDetails } from "src/app/shared/team-data";
import { Quarters, Shot_Zones } from "src/app/shared/interface";
import { SecondaryService } from "src/app/services/secondary.service";

@Component({
    selector: 'chart-settings',
    templateUrl: 'chart-settings.component.html',
    styleUrls: ['chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit {
    @Input() selectedTeam: string;
    @Input() selectedTeamDetails: TeamDetails;
    chartSubject: string[] = [];
    chartShotType: string[] = [];
    chartQuarters: string[];
    quarters: string[];
    shotTypes: string[] = [];
    timeInterval: any = {
        upper: 12,
        lower: 0
    }
    querySubmitError: string = '';


    constructor(private apiService: NbaApiService, private secondaryService: SecondaryService) {
        this.shotTypes = Object.values(Shot_Zones);
        this.quarters = Quarters;
    }
    ngOnInit(): void {
        this.apiService.resetSettings.subscribe(reset => {
            this.resetPreviousSettings();
        })
    }

    public shotChartDetailsPayLoad() {
        const subjectList = "'" + this.chartSubject.join("','") + "'";
        const shotTypeList = "'" + this.chartShotType.join("','") + "'";
        const qtrList = "'" + this.chartQuarters.join("','") + "'";
        return {
            subject: subjectList,
            shotType: shotTypeList,
            qtr: qtrList,
            timeInterval: `${this.timeInterval.lower} AND ${this.timeInterval.upper}`
        }
    };

    makeChartQuery() {
        if (this.checkIfQtrsSelected() && this.checkIfSubjectSelected() && this.checkIfShotAreaSelected()) {
            this.apiService.notifyChartOfRequest(this.shotChartDetailsPayLoad())
        } else {
            this.allParametersChecked();
            this.secondaryService.presentErrorToast(this.querySubmitError);
            this.querySubmitError = '';
        }


    }

    checkIfQtrsSelected(): boolean {
        return this.chartQuarters && this.chartQuarters.length != 0 ? true : false;
    }
    checkIfSubjectSelected(): boolean {
        return this.chartSubject && this.chartSubject.length != 0 ? true : false;
    }
    checkIfShotAreaSelected(): boolean {
        return this.chartShotType && this.chartShotType.length != 0 ? true : false;
    }

    allParametersChecked() {
        this.querySubmitError = !this.checkIfQtrsSelected() ? this.querySubmitError + "Please Check At Least 1 Quarter! \n" : this.querySubmitError;
        this.querySubmitError = !this.checkIfSubjectSelected() ? this.querySubmitError + "Please Select at Least 1 Chart Subject!\n" : this.querySubmitError;
        this.querySubmitError = !this.checkIfShotAreaSelected() ? this.querySubmitError + "Please Select at Least 1 Shot Area!\n" : this.querySubmitError;
    }

    resetPreviousSettings() {
        this.chartSubject = [];
        this.chartShotType = [];
        this.chartQuarters = [];
        this.timeInterval = {
            upper: 12,
            lower: 0
        }
    }

}