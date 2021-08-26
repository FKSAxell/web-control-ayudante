export default class Utils {
    static twoDigits(value: number) {
        if (value < 10) return `0${value}`
        return `${value}`
    }
}
