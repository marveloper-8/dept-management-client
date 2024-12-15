import { gql } from "@apollo/client";

export const CREATE_DEPARTMENT = gql`
    mutation CreateDepartment($input: CreateDepartmentInput!) {
        createDepartment(input: $input) {
            id
            name
            subDepartments {
                id
                name
            }
        }
    }
`;