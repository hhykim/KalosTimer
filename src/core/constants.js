export const COLOR = {
    ACTIVE: [255, 102, 51, 255],
    INACTIVE: [102, 221, 255, 255],
    TOLERANCE: 10
};

export const DELAY = {
    P1: {
        COMMON: 15000
    },
    P2: {
        NORMAL: 15000,
        CHAOS: 13500,
        EXTREME: 13000
    },
    ENHANCED: {
        P1: {
            CHAOS: 12000,
            EXTREME: 10000
        },
        P2: {
            CHAOS: 11500,
            EXTREME: 11000
        }
    }
};

export const OFFSET = {
    PRE_TRIGGER: 4500,
    P1: {
        CHAOS: DELAY.P1.COMMON - DELAY.ENHANCED.P1.CHAOS,
        EXTREME: DELAY.P1.COMMON - DELAY.ENHANCED.P1.EXTREME
    },
    P2: {
        COMMON: DELAY.P2.CHAOS - DELAY.ENHANCED.P2.CHAOS
    }
};
