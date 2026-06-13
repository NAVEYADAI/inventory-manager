export enum UOM {
    GRAM = 'gram',
    KILOGRAM = 'kilogram',
    TON = 'ton',
    LITER = 'liter',
    MILLILITER = 'milliliter',
    CUP = 'cup',
    KOBE = 'kobe',
    PIECE = 'piece',
    TABLESPOON = 'tablespoon',
    TEASPOON = 'teaspoon',
}

export enum MeasurementType {
    WEIGHT = 'weight',
    VOLUME = 'volume',
    COUNT = 'count',
}

export const UOM_hebrew_names: Record<UOM, string> = {
    [UOM.GRAM]: 'גרם',
    [UOM.KILOGRAM]: 'קילוגרם',
    [UOM.LITER]: 'ליטר',
    [UOM.MILLILITER]: 'מיליליטר',
    [UOM.PIECE]: 'יחידה',
    [UOM.TABLESPOON]: "כף",
    [UOM.TEASPOON]: "כפית",
    [UOM.TON]: "טון",
    [UOM.KOBE]: "קוב",
    [UOM.CUP]: "כוס"
};

export const MeasurementType_hebrew_names: Record<MeasurementType, string> = {
    [MeasurementType.WEIGHT]: 'משקל',
    [MeasurementType.VOLUME]: 'נפח',
    [MeasurementType.COUNT]: 'כמות',
};