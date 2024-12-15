import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
    query GetDepartments {
        departments {
            id
            name
            subDepartments {
                id
                name
            }
        }
    }
`;