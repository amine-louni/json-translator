export const isNestedObject = (object: object) => {
    for (const key in object) {
        const firstLevelKey = object[key as keyof object];
        if (typeof firstLevelKey === 'object') {
            return true;
        }
        return false;
    }
}