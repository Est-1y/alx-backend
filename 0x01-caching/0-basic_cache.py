#!/usr/bin/env python3

""" Basic cache"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """BasicCache inheriting from BaseCaching"""

    def put(self, key, item):
        """assigning item value for key to the dictionary
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """returning the value in self.cache_data
        """

        return self.cache_data.get(key, None)
