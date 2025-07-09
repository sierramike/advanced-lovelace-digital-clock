import {DateTimeFormatOptions} from 'luxon';
import {LocaleOptions} from 'luxon/src/datetime';

export default interface IDigitalClockLineLayout {
    textAlign?: string;
    lineHeight?: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    additionalCSS?: string;
}

export default interface IDigitalClockConfig {
    interval?: number;
    timeFormat?: (LocaleOptions & DateTimeFormatOptions) | string;
    dateFormat?: (LocaleOptions & DateTimeFormatOptions) | string;
    timeZone?: string;
    locale?: string;
    firstLineFormat?: (LocaleOptions & DateTimeFormatOptions) | string;
    secondLineFormat?: (LocaleOptions & DateTimeFormatOptions) | string;
    firstLineLayout?: IDigitalClockLineLayout;
    secondLineLayout?: IDigitalClockLineLayout;
    padding?: string;
    background?: string;
    additionalCSS?: string;
}
