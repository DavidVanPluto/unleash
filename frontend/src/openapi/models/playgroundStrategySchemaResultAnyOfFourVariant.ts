/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { PlaygroundStrategySchemaResultAnyOfFourVariantPayload } from './playgroundStrategySchemaResultAnyOfFourVariantPayload';

/**
 * The feature variant you receive based on the provided context or the _disabled
                          variant_. If a feature is disabled or doesn't have any
                          variants, you would get the _disabled variant_.
                          Otherwise, you'll get one of the feature's defined variants.
 */
export type PlaygroundStrategySchemaResultAnyOfFourVariant = {
    /** The variant's name. If there is no variant or if the toggle is disabled, this will be `disabled` */
    name: string;
    /** Whether the variant is enabled or not. If the feature is disabled or if it doesn't have variants, this property will be `false` */
    enabled: boolean;
    /** An optional payload attached to the variant. */
    payload?: PlaygroundStrategySchemaResultAnyOfFourVariantPayload;
} | null;
