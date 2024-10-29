#!/usr/bin/env python3

""" FIFO cache
"""

BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """ inheriting from BaseCaching
    """

    def __init__(self):
        """
        """
        super().__init__()
        self.cache_keys = []

    def put(self, key, item):
        """ Assign to the dictionary self.cache_data key value.
        """
        if key is None or item is None:
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            first_key = self.cache_keys.pop(0)
            del self.cache_data[first_key]
            print(f"DISCARD: {first_key}")
        self.cache_keys.append(key)
        self.cache_data[key] = item

    def get(self, key):
        """ Return value in self.cache_data
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
