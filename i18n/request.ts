import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const supportedLocales = ['en', 'bn'];

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    
    // Ensure we only use supported locales, fallback to 'en'
    const locale = supportedLocales.includes(cookieLocale) ? cookieLocale : 'en';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
