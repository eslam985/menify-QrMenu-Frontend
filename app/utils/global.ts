function resetObj(obj: Record<string, unknown>) {
  Object.keys(obj).forEach(key => obj[key] = undefined);
}

function sortByProperty<T>(arr: T[], key: keyof T, asc: boolean = true): T[] {
    return [...arr].sort((a, b) => {
        const valA: T[keyof T] = a[key]
        const valB: T[keyof T] = b[key]

        // 1. التعامل مع القيم الفارغة (null / undefined) وإرسالها للنهاية
        if (valA == null && valB == null) return 0
        if (valA == null) return asc ? 1 : -1
        if (valB == null) return asc ? -1 : 1

        let comparison: number = 0

        // 2. إذا كانت القيم أرقاماً حقيقية
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB
        }
        // 3. للنصوص والأنواع الأخرى نستخدم localeCompare
        else {
            const strA = String(valA)
            const strB = String(valB)

            comparison = strA.localeCompare(strB, undefined, {
                numeric: true, // يضمن ترتيب "الموسم 2" قبل "الموسم 10"
                sensitivity: 'base', // يتجاهل الفروق بين الحروف الكبيرة والصغيرة والتشكيل
            })
        }

        return asc ? comparison : -comparison
    })
}
/*
// 1. ترتيب المواسم بالرقم
this.seasons = sortByProperty(seasonsList, 'season_number')

// 2. ترتيب العناوين أبجدياً بالأسم (نصوص)
this.episodes = sortByProperty(episodesList, 'title')

// 3. ترتيب تنازلي بناءً على تاريخ الإنشاد أو أي نص/رقم آخر
this.media = sortByProperty(mediaList, 'created_at', false)
*/
const toNumber = (val: unknown): number | null => {
    if (val === undefined || val === null || val === '') return null

    const target = Array.isArray(val) ? val[0] : val
    const parsed = Number(target)

    // التأكد من أن الناتج رقم صالح وليس NaN
    return Number.isNaN(parsed) ? null : parsed
}

export { sortByProperty, toNumber, resetObj }
