function getImageOriginalSize(data: string | File): Promise<{width: number}> {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = typeof data === 'string' ? data : URL.createObjectURL(data);
        image.addEventListener('load', () => {
            resolve({ width: image.naturalWidth });
        });
    });
}

export default getImageOriginalSize;