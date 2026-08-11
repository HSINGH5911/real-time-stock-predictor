import unittest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database.client import RedisClient, redis_client

class TestCustomRedisDatabase(unittest.TestCase):

    def setUp(self):
        self.client = redis_client

    def test_key_value_string_operations(self):
        """Tests SET, GET, EXISTS, DELETE operations on RedisClient"""
        self.client.set("test_key", "hello_stockpulse")
        self.assertEqual(self.client.get("test_key"), "hello_stockpulse")
        self.assertTrue(self.client.exists("test_key"))
        
        self.client.delete("test_key")
        self.assertFalse(self.client.exists("test_key"))

    def test_hash_operations(self):
        """Tests HSET, HGET, HGETALL hash table operations"""
        self.client.hset("stock:TEST", "price", "150.25")
        self.client.hset("stock:TEST", "sentiment", "0.75")
        
        self.assertEqual(self.client.hget("stock:TEST", "price"), "150.25")
        
        all_data = self.client.hgetall("stock:TEST")
        self.assertIsInstance(all_data, dict)
        self.assertEqual(all_data.get("price"), "150.25")
        self.assertEqual(all_data.get("sentiment"), "0.75")

    def test_list_operations(self):
        """Tests LPUSH, LRANGE, LLEN list operations"""
        self.client.delete("test_list")
        self.client.lpush("test_list", "item1", "item2")
        
        items = self.client.lrange("test_list", 0, -1)
        self.assertEqual(len(items), 2)
        self.assertIn("item1", items)
        self.assertIn("item2", items)

    def test_stream_operations(self):
        """Tests XADD, XRANGE stream data structure operations"""
        stream_key = "test_stream"
        entry_id = self.client.xadd(stream_key, {"event": "Earnings", "ticker": "AAPL"})
        self.assertIsNotNone(entry_id)
        
        entries = self.client.xrange(stream_key, count=10)
        self.assertGreater(len(entries), 0)

if __name__ == "__main__":
    unittest.main()
