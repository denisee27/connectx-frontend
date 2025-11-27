
import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { ChevronDown, Check } from 'lucide-react';
import { useCategories, useCountries } from '../hooks/useListEvent';

export default function EventFilter({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sort, setSort] = useState('datetime_asc');

  const debouncedSearch = useDebounce(search, 300);
  const debouncedSelectedCountry = useDebounce(selectedCountry, 300);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: countries = [], isLoading: isLoadingCountries } = useCountries();

  useEffect(() => {
    onFilterChange({
      title: debouncedSearch,
      categories: selectedCategory?.id,
      country: debouncedSelectedCountry?.id,
      sort: sort,
    });
  }, [debouncedSearch, selectedCategory, debouncedSelectedCountry, sort, onFilterChange]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Title</label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 mt-1 block w-full rounded-md bg-white border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm h-12"
            placeholder="Enter event title..."
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
          <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm h-12">
                <span className="block truncate my-auto">{selectedCategory?.name || 'Select a category'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {isLoadingCategories ? (
                  <div className="px-3 py-2">Loading...</div>
                ) : (
                  categories.map((category) => (
                    <Listbox.Option
                      key={category.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={category}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                          >
                            {category.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Country Filter */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <Listbox value={selectedCountry} onChange={setSelectedCountry}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm h-12">
                <span className="block truncate my-auto">{selectedCountry?.name || 'Select a country'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {isLoadingCountries ? (
                  <div className="px-3 py-2">Loading...</div>
                ) : (
                  countries.map((country) => (
                    <Listbox.Option
                      key={country.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={country}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {country.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort by</label>
          <div className="mt-2 flex space-x-4">
            <div className="flex items-center">
              <input
                id="sort_asc"
                name="sort"
                type="radio"
                value="datetime_asc"
                checked={sort === 'datetime_asc'}
                onChange={(e) => setSort(e.target.value)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="sort_asc" className="ml-2 block text-sm text-gray-900">Nearest</label>
            </div>
            <div className="flex items-center">
              <input
                id="sort_desc"
                name="sort"
                type="radio"
                value="datetime_desc"
                checked={sort === 'datetime_desc'}
                onChange={(e) => setSort(e.target.value)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="sort_desc" className="ml-2 block text-sm text-gray-900">Oldest</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
