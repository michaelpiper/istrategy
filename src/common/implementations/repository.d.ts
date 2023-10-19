/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/**
   * Models
   */

import { type Prisma } from '@prisma/client'

/**
   * Model Repository
   */

export interface AggregateRepository {
  _count: RepositoryCountAggregateOutputType | null
  _avg: RepositoryAvgAggregateOutputType | null
  _sum: RepositorySumAggregateOutputType | null
  _min: RepositoryMinAggregateOutputType | null
  _max: RepositoryMaxAggregateOutputType | null
}

export interface RepositoryAvgAggregateOutputType {
  id: number | null
}

export interface RepositorySumAggregateOutputType {
  id: number | null
}

export interface RepositoryMinAggregateOutputType {
  id: number | null
}

export interface RepositoryMaxAggregateOutputType {
  id: number | null
}

export interface RepositoryCountAggregateOutputType {
  id: number
  _all: number
}

export interface RepositoryAvgAggregateInputType {
  id?: true
}

export interface RepositorySumAggregateInputType {
  id?: true
}

export interface RepositoryMinAggregateInputType {
  id?: true
}

export interface RepositoryMaxAggregateInputType {
  id?: true
}

export interface RepositoryCountAggregateInputType {
  id?: true
  _all?: true
}

export interface RepositoryAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Filter which Repository to aggregate.
     */
  where?: RepositoryWhereInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Repositories to fetch.
     */
  orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
  cursor?: RepositoryWhereUniqueInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Repositories from the position of the cursor.
     */
  take?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Repositories.
     */
  skip?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Repositories
    **/
  _count?: true | RepositoryCountAggregateInputType
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
  _avg?: RepositoryAvgAggregateInputType
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
  _sum?: RepositorySumAggregateInputType
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
  _min?: RepositoryMinAggregateInputType
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
  _max?: RepositoryMaxAggregateInputType
}

export type GetRepositoryAggregateType<T extends RepositoryAggregateArgs> = {
  [P in keyof T & keyof AggregateRepository]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : GetScalarType<T[P], AggregateRepository[P]>
    : GetScalarType<T[P], AggregateRepository[P]>
}

export interface RepositoryGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  where?: RepositoryWhereInput
  orderBy?: RepositoryOrderByWithAggregationInput | RepositoryOrderByWithAggregationInput[]
  by: RepositoryScalarFieldEnum[] | RepositoryScalarFieldEnum
  having?: RepositoryScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: RepositoryCountAggregateInputType | true
  _avg?: RepositoryAvgAggregateInputType
  _sum?: RepositorySumAggregateInputType
  _min?: RepositoryMinAggregateInputType
  _max?: RepositoryMaxAggregateInputType
}

export interface RepositoryGroupByOutputType {
  id: number
  _count: RepositoryCountAggregateOutputType | null
  _avg: RepositoryAvgAggregateOutputType | null
  _sum: RepositorySumAggregateOutputType | null
  _min: RepositoryMinAggregateOutputType | null
  _max: RepositoryMaxAggregateOutputType | null
}

  type GetRepositoryGroupByPayload<T extends RepositoryGroupByArgs> = Prisma.PrismaPromise<
  Array<
  PickEnumerable<RepositoryGroupByOutputType, T['by']> &
  {
    [P in ((keyof T) & (keyof RepositoryGroupByOutputType))]: P extends '_count'
      ? T[P] extends boolean
        ? number
        : GetScalarType<T[P], RepositoryGroupByOutputType[P]>
      : GetScalarType<T[P], RepositoryGroupByOutputType[P]>
  }
  >
  >

export type RepositorySelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
  id?: boolean
}, ExtArgs['result']['repository']>

export interface RepositorySelectScalar {
  id?: boolean
}

export interface $RepositoryPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  name: 'Repository'
  objects: {}
  scalars: $Extensions.GetResult<{
    id: number
  }, ExtArgs['result']['repository']>
  composites: {}
}

  type RepositoryGetPayload<S extends boolean | null | undefined | RepositoryDefaultArgs> = $Result.GetResult<$RepositoryPayload, S>

  type RepositoryCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> =
    Omit<RepositoryFindManyArgs, 'select' | 'include'> & {
      select?: RepositoryCountAggregateInputType | true
    }

export interface RepositoryDelegate<ExtArgs> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Repository'], meta: { name: 'Repository' } }
  /**
     * Find zero or one Repository that matches the filter.
     * @param {RepositoryFindUniqueArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
  findUnique: <T extends RepositoryFindUniqueArgs<ExtArgs>>(
    args: SelectSubset<T, RepositoryFindUniqueArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

  /**
     * Find one Repository that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {RepositoryFindUniqueOrThrowArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
  findUniqueOrThrow: <T extends RepositoryFindUniqueOrThrowArgs<ExtArgs>>(
    args?: SelectSubset<T, RepositoryFindUniqueOrThrowArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

  /**
     * Find the first Repository that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryFindFirstArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
  findFirst: <T extends RepositoryFindFirstArgs<ExtArgs>>(
    args?: SelectSubset<T, RepositoryFindFirstArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

  /**
     * Find the first Repository that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryFindFirstOrThrowArgs} args - Arguments to find a Repository
     * @example
     * // Get one Repository
     * const repository = await prisma.repository.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
  findFirstOrThrow: <T extends RepositoryFindFirstOrThrowArgs<ExtArgs>>(
    args?: SelectSubset<T, RepositoryFindFirstOrThrowArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

  /**
     * Find zero or more Repositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Repositories
     * const repositories = await prisma.repository.findMany()
     *
     * // Get first 10 Repositories
     * const repositories = await prisma.repository.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const repositoryWithIdOnly = await prisma.repository.findMany({ select: { id: true } })
     *
    **/
  findMany: <T extends RepositoryFindManyArgs<ExtArgs>>(
    args?: SelectSubset<T, RepositoryFindManyArgs<ExtArgs>>
  ) => Prisma.PrismaPromise<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'findMany'>>

  /**
     * Create a Repository.
     * @param {RepositoryCreateArgs} args - Arguments to create a Repository.
     * @example
     * // Create one Repository
     * const Repository = await prisma.repository.create({
     *   data: {
     *     // ... data to create a Repository
     *   }
     * })
     *
    **/
  create: <T extends RepositoryCreateArgs<ExtArgs>>(
    args: SelectSubset<T, RepositoryCreateArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

  /**
     * Create many Repositories.
     *     @param {RepositoryCreateManyArgs} args - Arguments to create many Repositories.
     *     @example
     *     // Create many Repositories
     *     const repository = await prisma.repository.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
    **/
  createMany: <T extends RepositoryCreateManyArgs<ExtArgs>>(
    args?: SelectSubset<T, RepositoryCreateManyArgs<ExtArgs>>
  ) => Prisma.PrismaPromise<BatchPayload>

  /**
     * Delete a Repository.
     * @param {RepositoryDeleteArgs} args - Arguments to delete one Repository.
     * @example
     * // Delete one Repository
     * const Repository = await prisma.repository.delete({
     *   where: {
     *     // ... filter to delete one Repository
     *   }
     * })
     *
    **/
  delete: <T extends RepositoryDeleteArgs<ExtArgs>>(
    args: SelectSubset<T, RepositoryDeleteArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

  /**
     * Update one Repository.
     * @param {RepositoryUpdateArgs} args - Arguments to update one Repository.
     * @example
     * // Update one Repository
     * const repository = await prisma.repository.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
    **/
  update: <T extends RepositoryUpdateArgs<ExtArgs>>(
    args: SelectSubset<T, RepositoryUpdateArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

  /**
     * Delete zero or more Repositories.
     * @param {RepositoryDeleteManyArgs} args - Arguments to filter Repositories to delete.
     * @example
     * // Delete a few Repositories
     * const { count } = await prisma.repository.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
    **/
  deleteMany: <T extends RepositoryDeleteManyArgs<ExtArgs>>(
    args?: SelectSubset<T, RepositoryDeleteManyArgs<ExtArgs>>
  ) => Prisma.PrismaPromise<BatchPayload>

  /**
     * Update zero or more Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Repositories
     * const repository = await prisma.repository.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
    **/
  updateMany: <T extends RepositoryUpdateManyArgs<ExtArgs>>(
    args: SelectSubset<T, RepositoryUpdateManyArgs<ExtArgs>>
  ) => Prisma.PrismaPromise<BatchPayload>

  /**
     * Create or update one Repository.
     * @param {RepositoryUpsertArgs} args - Arguments to update or create a Repository.
     * @example
     * // Update or create a Repository
     * const repository = await prisma.repository.upsert({
     *   create: {
     *     // ... data to create a Repository
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Repository we want to update
     *   }
     * })
    **/
  upsert: <T extends RepositoryUpsertArgs<ExtArgs>>(
    args: SelectSubset<T, RepositoryUpsertArgs<ExtArgs>>
  ) => Prisma__RepositoryClient<$Result.GetResult<$RepositoryPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

  /**
     * Count the number of Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryCountArgs} args - Arguments to filter Repositories to count.
     * @example
     * // Count the number of Repositories
     * const count = await prisma.repository.count({
     *   where: {
     *     // ... the filter for the Repositories we want to count
     *   }
     * })
    **/
  count: <T extends RepositoryCountArgs>(
    args?: Subset<T, RepositoryCountArgs>,
  ) => Prisma.PrismaPromise<
  T extends $Utils.Record<'select', any>
    ? T['select'] extends true
      ? number
      : GetScalarType<T['select'], RepositoryCountAggregateOutputType>
    : number
  >

  /**
     * Allows you to perform aggregations operations on a Repository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
  aggregate: <T extends RepositoryAggregateArgs>(args: Subset<T, RepositoryAggregateArgs>) => Prisma.PrismaPromise<GetRepositoryAggregateType<T>>

  /**
     * Group by Repository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
  groupBy: <
      T extends RepositoryGroupByArgs,
      HasSelectOrTake extends Or<
      Extends<'skip', Keys<T>>,
      Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RepositoryGroupByArgs['orderBy'] }
        : { orderBy?: RepositoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? 'Error: "by" must not be empty.'
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ' in "having" needs to be provided in "by"',
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
    >(args: SubsetIntersection<T, RepositoryGroupByArgs, OrderByArg> & InputErrors) => {} extends InputErrors ? GetRepositoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Repository model
   */
  readonly fields: RepositoryFieldRefs
}

/**
   * The delegate class that acts as a "Promise-like" for Repository.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
export interface Prisma__RepositoryClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: 'PrismaPromise'

  /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
  then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null) => $Utils.JsPromise<TResult1 | TResult2>
  /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
  catch: <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null) => $Utils.JsPromise<T | TResult>
  /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
  finally: (onfinally?: (() => void) | undefined | null) => $Utils.JsPromise<T>
}

/**
   * Fields of the Repository model
   */
interface RepositoryFieldRefs {
  readonly id: FieldRef<'Repository', 'Int'>
}

// Custom InputTypes

/**
   * Repository findUnique
   */
export interface RepositoryFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * Filter, which Repository to fetch.
     */
  where: RepositoryWhereUniqueInput
}

/**
   * Repository findUniqueOrThrow
   */
export interface RepositoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * Filter, which Repository to fetch.
     */
  where: RepositoryWhereUniqueInput
}

/**
   * Repository findFirst
   */
export interface RepositoryFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * Filter, which Repository to fetch.
     */
  where?: RepositoryWhereInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Repositories to fetch.
     */
  orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Repositories.
     */
  cursor?: RepositoryWhereUniqueInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Repositories from the position of the cursor.
     */
  take?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Repositories.
     */
  skip?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Repositories.
     */
  distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
}

/**
   * Repository findFirstOrThrow
   */
export interface RepositoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * Filter, which Repository to fetch.
     */
  where?: RepositoryWhereInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Repositories to fetch.
     */
  orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Repositories.
     */
  cursor?: RepositoryWhereUniqueInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Repositories from the position of the cursor.
     */
  take?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Repositories.
     */
  skip?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Repositories.
     */
  distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
}

/**
   * Repository findMany
   */
export interface RepositoryFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * Filter, which Repositories to fetch.
     */
  where?: RepositoryWhereInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Repositories to fetch.
     */
  orderBy?: RepositoryOrderByWithRelationInput | RepositoryOrderByWithRelationInput[]
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Repositories.
     */
  cursor?: RepositoryWhereUniqueInput
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Repositories from the position of the cursor.
     */
  take?: number
  /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Repositories.
     */
  skip?: number
  distinct?: RepositoryScalarFieldEnum | RepositoryScalarFieldEnum[]
}

/**
   * Repository create
   */
export interface RepositoryCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * The data needed to create a Repository.
     */
  data?: XOR<RepositoryCreateInput, RepositoryUncheckedCreateInput>
}

/**
   * Repository createMany
   */
export interface RepositoryCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * The data used to create many Repositories.
     */
  data: RepositoryCreateManyInput | RepositoryCreateManyInput[]
  skipDuplicates?: boolean
}

/**
   * Repository update
   */
export interface RepositoryUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * The data needed to update a Repository.
     */
  data: XOR<RepositoryUpdateInput, RepositoryUncheckedUpdateInput>
  /**
     * Choose, which Repository to update.
     */
  where: RepositoryWhereUniqueInput
}

/**
   * Repository updateMany
   */
export interface RepositoryUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * The data used to update Repositories.
     */
  data: XOR<RepositoryUpdateManyMutationInput, RepositoryUncheckedUpdateManyInput>
  /**
     * Filter which Repositories to update
     */
  where?: RepositoryWhereInput
}

/**
   * Repository upsert
   */
export interface RepositoryUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * The filter to search for the Repository to update in case it exists.
     */
  where: RepositoryWhereUniqueInput
  /**
     * In case the Repository found by the `where` argument doesn't exist, create a new Repository with this data.
     */
  create: XOR<RepositoryCreateInput, RepositoryUncheckedCreateInput>
  /**
     * In case the Repository was found with the provided `where` argument, update it with this data.
     */
  update: XOR<RepositoryUpdateInput, RepositoryUncheckedUpdateInput>
}

/**
   * Repository delete
   */
export interface RepositoryDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
  /**
     * Filter which Repository to delete.
     */
  where: RepositoryWhereUniqueInput
}

/**
   * Repository deleteMany
   */
export interface RepositoryDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Filter which Repositories to delete
     */
  where?: RepositoryWhereInput
}

/**
   * Repository without action
   */
export interface RepositoryDefaultArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
  /**
     * Select specific fields to fetch from the Repository
     */
  select?: RepositorySelect<ExtArgs> | null
}
