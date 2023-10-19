interface $payload {name: string, scalars: Record<string, any>, objects: any, composites: any}
type $updatePayload = Record<string, any>

export type FactoryEntity<T extends $payload, O =T['objects']> = T['scalars'] & { [K in keyof O ]?: O[K] extends Array<$payload | null> ? Array<FactoryEntity<NonNullable<O[K][0]>>> : O[K] extends $payload | null ? FactoryEntity<NonNullable<O[K]>> : null }
export type FactoryUpdateEntity<T extends $updatePayload, O = T['scalars'] > = { [K in keyof O ]?: O[K] | null }
