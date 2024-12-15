export interface Department {
    id: number;
    name: string;
    subDepartments?: Department[];
}