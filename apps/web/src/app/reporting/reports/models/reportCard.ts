import { Observable } from "rxjs";

export interface ReportCard {
    title: string;
    subTitle: string;
    recordCount: Observable<number>
}