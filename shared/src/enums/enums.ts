export enum UOM {
    GRAM = 'gram',
    KILOGRAM = 'kilogram',
    TON = 'ton',
    LITER = 'liter',
    MILLILITER = 'milliliter',
    KOBE = 'kobe',
    PIECE = 'piece',
    TABLESPOON = 'tablespoon',
    TEASPOON = 'teaspoon',
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
    [UOM.KOBE]: "קוב"
};