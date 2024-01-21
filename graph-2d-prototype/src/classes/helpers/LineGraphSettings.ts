import Range from "./Range";

export default class LineGraphSettings {
    xRange: Range = new Range(0,50);
    yRange: Range = new Range(0,1);
    xGridInterval: number = 1;
    yGridInterval: number = 0.05;
    xLabelFractions: number = 0;
    yLabelFractions: number = 2;
    labelsLeft: number = 730;
    labelsTop: number = 350;
}