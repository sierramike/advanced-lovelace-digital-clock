/* eslint-disable @typescript-eslint/no-explicit-any */
import {css, CSSResult, html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators';
import {DateTime} from 'luxon';
import {HomeAssistant} from 'custom-card-helpers';

import {CARD_VERSION} from './const';
import IDigitalClockConfig from './IDigitalClockConfig';

/* eslint no-console: 0 */
console.info(
    `%c  Advanced Digital-Clock \n%c  Version ${CARD_VERSION}    `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'digital-clock',
    name: 'DigitalClock',
    description: 'A digital clock component',
});

@customElement('digital-clock')
export class DigitalClock extends LitElement {
    @property({attribute: false}) public hass!: HomeAssistant;
    @state() private _firstLine = '';
    @state() private _secondLine = '';
    @state() private _config?: IDigitalClockConfig;
    @state() private _interval = 1000;
    private _intervalId?: number;

    public setConfig(config: IDigitalClockConfig): void {
        this._config = { ...config, firstLineLayout: { ...config.firstLineLayout }, secondLineLayout: { ...config.secondLineLayout } };

        if (!(this._config.firstLineLayout === undefined)) {
            if (this._config.firstLineLayout?.textAlign?.toLowerCase() == "left")
                this._config.firstLineLayout.textAlign = "left";
            else if (this._config.firstLineLayout?.textAlign?.toLowerCase() == "right")
                this._config.firstLineLayout.textAlign = "right";
            else
                this._config.firstLineLayout.textAlign = "center";

            if (this._config.firstLineLayout?.lineHeight == "" || this._config.firstLineLayout?.lineHeight === undefined)
                this._config.firstLineLayout.lineHeight = "1em";
            if (this._config.firstLineLayout?.fontSize == "" || this._config.firstLineLayout?.fontSize === undefined)
                this._config.firstLineLayout.fontSize = "2.8em";
            if (this._config.firstLineLayout?.fontWeight == "" || this._config.firstLineLayout?.fontWeight === undefined)
                this._config.firstLineLayout.fontWeight = "bold";
        }

        if (!(this._config.secondLineLayout === undefined)) {
            if (this._config.secondLineLayout?.textAlign?.toLowerCase() == "left")
                this._config.secondLineLayout.textAlign = "left";
            else if (this._config.secondLineLayout?.textAlign?.toLowerCase() == "right")
                this._config.secondLineLayout.textAlign = "right";
            else
                this._config.secondLineLayout.textAlign = "center";

            if (this._config.secondLineLayout?.lineHeight == "" || this._config.secondLineLayout?.lineHeight === undefined)
                this._config.secondLineLayout.lineHeight = "1em";
            if (this._config.secondLineLayout?.fontSize == "" || this._config.secondLineLayout?.fontSize === undefined)
                this._config.secondLineLayout.fontSize = "1.6em";
            if (this._config.secondLineLayout?.fontWeight == "" || this._config.secondLineLayout?.fontWeight === undefined)
                this._config.secondLineLayout.fontWeight = "bold";
        }

        if (this._config.padding == "" || this._config.padding === undefined)
            this._config.padding = "8px 0";

        if (this._config.timeFormat)
            this._config.firstLineFormat = this._config.timeFormat;
        if (this._config.dateFormat)
            this._config.secondLineFormat = this._config.dateFormat;
        if (this._config.interval !== this._interval)
            this._interval = this._config.interval ?? 1000;
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        return changedProps.has('_firstLine') || changedProps.has('_secondLine') || changedProps.has('_config') || changedProps.has('hass');
    }

    public async getCardSize(): Promise<number> {
        return 3;
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);

        if (changedProperties.has('_interval')) {
            this._stopInterval();
            this._startInterval();
        }
        if (changedProperties.has('_config'))
            this._updateDateTime();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this._startInterval();
    }

    private _startInterval(): void {
        if (this._intervalId)
            return;

        this._intervalId = window.setInterval(this._updateDateTime.bind(this), this._interval);
    }

    private _stopInterval(): void {
        if (!this._intervalId)
            return;
        window.clearInterval(this._intervalId);
        this._intervalId = undefined;
    }

    private async _updateDateTime(): Promise<void> {
        const timeZone = this._config?.timeZone ?? this.hass?.config?.time_zone;
        const locale = this._config?.locale ?? this.hass?.locale?.language;

        let dateTime: DateTime = DateTime.local();
        /* if (!this._config?.useHATime) {
            dateTime = DateTime.local();
        } else {
            dateTime = DateTime.fromSeconds(await new Promise<number>((resolve) => {
                this.hass.connection.subscribeMessage(
                    (msg) => resolve(parseInt((msg as any).result, 10)),
                    {type: "render_template", template: '{{as_timestamp(now())}}'}
                );
            }));
        } */

        if (timeZone)
            dateTime = dateTime.setZone(timeZone);
        if (locale)
            dateTime = dateTime.setLocale(locale);

        let firstLine: string;
        let secondLine: string;

        if (typeof this._config?.firstLineFormat === 'string')
            firstLine = dateTime.toFormat(this._config.firstLineFormat);
        else
            firstLine = dateTime.toLocaleString(this._config?.firstLineFormat ?? {hour: '2-digit', minute: '2-digit'});

        if (typeof this._config?.secondLineFormat === 'string')
            secondLine = dateTime.toFormat(this._config.secondLineFormat);
        else
            secondLine = dateTime.toLocaleString(this._config?.secondLineFormat ?? {weekday: 'short', day: '2-digit', month: 'short'});

        if (firstLine !== this._firstLine)
            this._firstLine = firstLine;
        if (secondLine !== this._secondLine)
            this._secondLine = secondLine;
    }

    public disconnectedCallback(): void {
        this._stopInterval();
        super.disconnectedCallback();
    }

    protected render(): TemplateResult | void {
        const cardPadding = `padding:${this._config?.padding};`;
        const cardBackground = this._config?.background?.trim().length != 0 && this._config?.background != undefined ? `background:${this._config?.background};` : "";
        const cardCSS = this._config?.additionalCSS?.trim().length != 0 && this._config?.additionalCSS != undefined ? `${this._config?.additionalCSS};` : "";

        const flTextAlign = `text-align:${this._config?.firstLineLayout?.textAlign};`;
        const flLineHeight = `line-height:${this._config?.firstLineLayout?.lineHeight};`;
        const flColor = this._config?.firstLineLayout?.color?.trim().length != 0 && this._config?.firstLineLayout?.color != undefined ? `color:${this._config?.firstLineLayout?.color};` : "";
        const flFontSize = `font-size:${this._config?.firstLineLayout?.fontSize};`;
        const flFontFamily = this._config?.firstLineLayout?.fontFamily?.trim().length != 0 && this._config?.firstLineLayout?.fontFamily != undefined ? `font-family:${this._config?.firstLineLayout?.fontFamily};` : "";
        const flFontWeight = `font-weight:${this._config?.firstLineLayout?.fontWeight};`;
        const flCSS = this._config?.firstLineLayout?.additionalCSS?.trim().length != 0 && this._config?.firstLineLayout?.additionalCSS != undefined ? `${this._config?.firstLineLayout?.additionalCSS};` : "";

        const slTextAlign = `text-align:${this._config?.secondLineLayout?.textAlign};`;
        const slLineHeight = `line-height:${this._config?.secondLineLayout?.lineHeight};`;
        const slColor = this._config?.secondLineLayout?.color?.trim().length != 0 && this._config?.secondLineLayout?.color != undefined ? `color:${this._config?.secondLineLayout?.color};` : "";
        const slFontSize = `font-size:${this._config?.secondLineLayout?.fontSize};`;
        const slFontFamily = this._config?.secondLineLayout?.fontFamily?.trim().length != 0 && this._config?.secondLineLayout?.fontFamily != undefined ? `font-family:${this._config?.secondLineLayout?.fontFamily};` : "";
        const slFontWeight = `font-weight:${this._config?.secondLineLayout?.fontWeight};`;
        const slCSS = this._config?.secondLineLayout?.additionalCSS?.trim().length != 0 && this._config?.secondLineLayout?.additionalCSS != undefined ? `${this._config?.secondLineLayout?.additionalCSS};` : "";

        return html`
            <ha-card style="${cardPadding}${cardBackground}${cardCSS}">
                <span class="first-line" style="${flTextAlign}${flColor}${flLineHeight}${flFontSize}${flFontFamily}${flFontWeight}${flCSS}">${this._firstLine}</span>
                <span class="second-line" style="${slTextAlign}${slColor}${slLineHeight}${slFontSize}${slFontFamily}${slFontWeight}${slCSS}">${this._secondLine}</span>
            </ha-card>
        `;
    }

    static get styles(): CSSResult {
        return css`
          ha-card {
          }

          ha-card > span {
            display: block;
          }
        `;
    }

    static getStubConfig() {
      return {
        padding: "8px 0",
        firstLineLayout: {
          textAlign: "center",
          lineHeight: "1em",
          fontSize: "2.8em",
          fontWeight: "bold",
        },
        secondLineLayout: {
          textAlign: "center",
          lineHeight: "1em",
          fontSize: "1.6em",
          fontWeight: "bold",
        },
      };
    }
}
