/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { ChangeRequestCreateFeatureSchemaOneOfSixAction } from './changeRequestCreateFeatureSchemaOneOfSixAction';
import type { UpdateFeatureStrategySchema } from './updateFeatureStrategySchema';

/**
 * Update a strategy belonging to this feature.
 */
export type ChangeRequestCreateFeatureSchemaOneOfSix = {
    /** The name of this action. */
    action: ChangeRequestCreateFeatureSchemaOneOfSixAction;
    payload: UpdateFeatureStrategySchema;
};
