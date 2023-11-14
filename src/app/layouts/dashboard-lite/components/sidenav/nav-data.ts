import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        url: 'dashboard',
        icon: 'fal fa-home',
        label: 'Dashboard'
    },
    {
        url: 'products',
        icon: 'fal fa-box-open',
        label: 'Products',
        items: [
            {
                url: 'products/level1.1',
                label: 'Level 1.1',
                items: [
                    {
                        url: 'products/level2.1',
                        label: 'Level 2.1',
                    },
                    {
                        url: 'products/level2.2',
                        label: 'Level 2.2',
                        items: [
                            {
                                url: 'products/level3.1',
                                label: 'Level 3.1'
                            },
                            {
                                url: 'products/level3.2',
                                label: 'Level 3.2'
                            }
                        ]
                    }
                ]
            },
            {
                url: 'products/level1.2',
                label: 'Level 1.2',
            }
        ]
    },
    {
        url: 'statistics',
        icon: 'fal fa-chart-bar',
        label: 'Statistics'
    },
    {
        url: 'coupens',
        icon: 'fal fa-tags',
        label: 'Coupens',
        items: [
            {
                url: 'coupens/list',
                label: 'List Coupens'
            },
            {
                url: 'coupens/create',
                label: 'Create Coupens'
            }
        ]
    },
    {
        url: 'pages',
        icon: 'fal fa-file',
        label: 'Pages'
    },
    {
        url: 'media',
        icon: 'fal fa-camera',
        label: 'Media'
    },
    {
        url: 'settings',
        icon: 'fal fa-cog',
        label: 'Settings',
        expanded: true,
        items: [
            {
                url: 'settings/profile',
                label: 'Profile'
            },
            {
                url: 'settings/customize',
                label: 'Customize'
            }
        ]
    },
];
