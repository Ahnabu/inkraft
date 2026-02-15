export async function submitToIndexNow(urls: string[]) {
    const apiKey = '004ca8cbf9503239a37988e1ef2e16da'; // Ideally this should be an environment variable, but for public verification file matching it's fine here too.
    const host = 'inkraftblog.vercel.app'; // Replace with your actual domain if different
    const keyLocation = `https://${host}/${apiKey}.txt`;

    try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                host,
                key: apiKey,
                keyLocation,
                urlList: urls,
            }),
        });

        if (response.ok) {
            console.log('Successfully submitted to IndexNow');
            return true;
        } else {
            console.error('Failed to submit to IndexNow', response.status, await response.text());
            return false;
        }
    } catch (error) {
        console.error('Error submitting to IndexNow', error);
        return false;
    }
}
