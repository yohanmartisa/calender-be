import {
  PAGINATION_LIMIT_ATTRIBUTE,
  PAGINATION_PAGINATE_ATTRIBUTE,
  PAGINATION_OFFSET_ATTRIBUTE,
  PAGINATION_PAGE_ATTRIBUTE
} from './repository.constants';

export const transformPaginateOptions = (opts) => {
  const paginateOptions = { ...opts.paginateOptions };
  Object.keys(opts.paginateOptions).forEach((key) => {
    if (key === PAGINATION_PAGE_ATTRIBUTE) {
      paginateOptions[PAGINATION_OFFSET_ATTRIBUTE] = (opts.paginateOptions[key] - 1)
        * opts.paginateOptions[PAGINATION_PAGINATE_ATTRIBUTE];
    } else if (key === PAGINATION_PAGINATE_ATTRIBUTE) {
      paginateOptions[PAGINATION_LIMIT_ATTRIBUTE] = opts.paginateOptions[key];
    } else {
      paginateOptions[key] = opts.paginateOptions[key];
    }
  });
  return paginateOptions;
};
