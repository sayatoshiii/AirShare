export const uuid = {
    v4: (): string => {
        return self.crypto.randomUUID();
    },
};
