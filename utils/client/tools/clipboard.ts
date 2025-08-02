export const handlePaste = (callback: any) => {
    let pressed = false;

    addEventListener("keydown", (e) => {
        if (pressed || e.key != "v" || !e.ctrlKey) return;
        pressed = true;

        callback?.();
    });

    addEventListener("keyup", (e) => {
        pressed = false;
    });
};
