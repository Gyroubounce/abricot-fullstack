export declare const getTaskComments: (taskId: string) => Promise<{
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
        email: string;
        id: string;
        name: string | null;
    };
}[]>;
//# sourceMappingURL=taskComments.d.ts.map