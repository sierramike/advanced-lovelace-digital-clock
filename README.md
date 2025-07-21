# Advanced Digital Clock

A fork of the original custom digital clock card for Home Assistant by wassy92x.

This version has a lot of new options to customize to be able to style the card (text alignment, font, color, card color, and any additional custom CSS).

[![GitHub Release][releases-shield]][releases]
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![License][license-shield]](LICENSE.md)

![Image of Digital Clock Card](https://github.com/sierramike/lovelace-advanced-digital-clock/blob/master/.images/advanced-digital-clock.png?raw=true)

## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:digital-clock`                      |                     |
| locale            | string  | **Optional** | Locale to use for formatting. For example `de` | locale set in your home assistant profile otherwise your browser locale |
| timeZone          | string  | **Optional** | Time zone to use. For example `Europe/Berlin` | time zone set in your home assistant profile otherwise your browser time zone |
| firstLineFormat &#124; timeFormat   | object &#124; string | **Optional** | Format of first line (`none` will disable the line)           | { hour: '2-digit', minute: '2-digit' } |
| secondLineFormat &#124; dateFormat | object  &#124; string  | **Optional** | Format of second line (`none` will disable the line)          | { weekday: 'short', day: '2-digit', month: 'short' } |
| padding           | string  | **Optional** | Padding in CSS format for the card          | 8px 0               |
| background        | string  | **Optional** | Background of the card. Can be any valid CSS color (eg. `red`, `#FF0000`, ...) or an url to an image (eg. `url('http://path.to/image.jpg'`) | |
| additionalCSS     | string  | **Optional** | Any additional CSS you wish to add to the card for maximum customization (eg. `border:none`) |  |
| firstLineLayout &#124; secondLineLayout | object `DigitalClockLineLayout` (see below) | **Optional** | Layout parameters for each text line | |

If `firstLineFormat` respectively `secondLineFormat` is a string, it can be every format, which is valid in Luxon.
See: [https://moment.github.io/luxon/#/formatting?id=toformat](https://moment.github.io/luxon/#/formatting?id=toformat)

If `firstLineFormat` respectively `secondLineFormat` is an object, it can be every valid object, which can be passed as options to the Luxon-function `toLocalString()`.
See: [https://moment.github.io/luxon/#/formatting?id=tolocalestring-strings-for-humans](https://moment.github.io/luxon/#/formatting?id=tolocalestring-strings-for-humans)

If `timeFormat` is specified, it will override `firstLineFormat` and `dateFormat` will override `secondLineFormat`.

## DigitalClockLineLayout object options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| textAlign         | string  | **Optional** | Text alignment (`left`, `center` or `right`). Will render as `text-align` CSS property. | `center`            |
| lineHeight        | string  | **Optional** | Height of the line. Will render as `line-height` CSS property. | `1em` |
| color             | string  | **Optional** | Color of the text. Can be any valid CSS color value (eg. `red`, `#FF0000`, ...). Will render as `color` CSS property. | empty (inherits page style) |
| fontSize          | string  | **Optional** | Font size of the line. Will render as `font-size` CSS property. | `2.8em` for first line, `1.6em` for second line |
| fontFamily        | string  | **Optional** | Font of the line. Will render as `font-family` CSS property. | empty (inherits page style) |
| fontWeight        | string  | **Optional** | Font weight of the line (eg. `100`, `200`, ..., `lighter`, `bold`, `normal`, ...). Will render as `font-weight` CSS property. | `bold` |
| additionalCSS     | string  | **Optional** | Any additional CSS you wish to add to the text line for maximum customization (eg.  `text-decoration:underline`) |  |

Leave any option empty or remove it from configuration and it will use default value.

Note: default values keep original card by wassy92x behavior.

# Examples

This section shows several card styles and the corresponding yaml code.

## Thin font, left alignment, image background on card, colored text

![Image of Digital Clock Card](https://github.com/sierramike/lovelace-advanced-digital-clock/blob/master/.images/advanced-digital-clock.png?raw=true)

```
type: custom:digital-clock
padding: 4px 20px
background: url('https://path.to/image.jpg')
firstLineFormat: HH:mm
secondLineFormat: cccc d LLLL yyyy
firstLineLayout:
  textAlign: left
  lineHeight: 1.25em
  fontSize: 2.8em
  fontWeight: 300
  color: blue
secondLineLayout:
  textAlign: left
  lineHeight: 1.25em
  fontSize: 1.6em
  fontWeight: 300
  color: green
```

## Bold font, big text, transparent card with no border, with seconds, time zone on second line

![Image of Digital Clock Card](https://github.com/sierramike/lovelace-advanced-digital-clock/blob/master/.images/advanced-digital-clock-sample2.png?raw=true)

```
type: custom:digital-clock
padding: 8px 0
background: transparent
additionalCSS: border:none
firstLineFormat: HH:mm:ss
secondLineFormat: z
firstLineLayout:
  textAlign: center
  lineHeight: 1em
  fontSize: 4.8em
  fontWeight: bold
secondLineLayout:
  textAlign: center
  lineHeight: 1em
  fontSize: 1.6em
  fontWeight: bold
```

## Only time, second line disable, colored text, transparent card with no border, right alignment

![Image of Digital Clock Card](https://github.com/sierramike/lovelace-advanced-digital-clock/blob/master/.images/advanced-digital-clock-sample3.png?raw=true)

```
type: custom:digital-clock
padding: 8px 20px
background: transparent
additionalCSS: border:none
firstLineFormat: HH:mm
secondLineFormat: none
firstLineLayout:
  textAlign: right
  lineHeight: 1em
  fontSize: 8em
  fontWeight: 100
  color: coral
```


[license-shield]: https://img.shields.io/github/license/sierramike/lovelace-advanced-digital-clock.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/sierramike/lovelace-advanced-digital-clock.svg?style=for-the-badge
[releases]: https://github.com/sierramike/lovelace-advanced-digital-clock/releases
