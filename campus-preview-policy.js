'use strict';
(() => {
    const split = [4, 3, 3];
    const policy = {
        simulation: {
            title: 'Simulacro de muestra', type: 'Muestra gratuita', kind: 'mini',
            minutes: 10, questionCount: split.reduce((sum, count) => sum + count, 0), split,
        },
        evaluationIds: ['morfo-01', 'biologia-01'],
        evaluationCount: 5,
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = policy;
    else window.CampusPreviewPolicy = policy;
})();
