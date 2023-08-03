/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { ChangeRequestChangeSchema } from './changeRequestChangeSchema';
import type { ChangeRequestDefaultChangeSchema } from './changeRequestDefaultChangeSchema';

/**
 * A feature and all its suggested changes.
 */
export interface ChangeRequestFeatureSchema {
    /** The name of the feature */
    name: string;
    /** A string describing the conflicts related to this change. Only present if there are any concflicts on the feature level. */
    conflict?: string;
    /** List of changes inside change request. This list may be empty when listing all change requests for a project. */
    changes: ChangeRequestChangeSchema[];
    defaultChange?: ChangeRequestDefaultChangeSchema;
}
