---
title: Parquet files, batches and shuffling
draft: true
tags: 
date:
---
In a previous article, I explained why I chose to store my chess games in multiple parquet files and how they are formatted to minimize disk memory.
Because of this formatting, after retrieving lines from parquet files, the data need a small processing step to be prepared for being fed into the neural network.
So I combined parquet dataset with a custom torch Dataset and DataLoader to benefit from prefetch and other torch perks.  

```python
import pyarrow.dataset as ds
from torch.utils.data import Dataset, DataLoader

class ParquetChessDataset(Dataset):  
    """Dataset for the Parquet Chess DB."""  
  
    def __init__(self,  
                 path: str,  
                 ) -> None:  
        """Initializes the ParquetChessDataset class.  
  
        Args:
	        path (str): The path to the Parquet file.             
        """
		self.dataset = ds.dataset(source=self.path,  
								  format="parquet",  
								  partitioning="hive")
        self.indices = np.arange(len(self.dataset))
        self.columns = ["pieces", "active_color", "castlings"]  


    def __getitems__(self, indices: list[int] -> Tensor:  
        """Returns the items at the given indices."""  
        indices = [self.indices[i] for i in indices]  
  
        data = self.dataset.take(indices=indices,  
								 columns=self.columns)  
  
        boards = self.transform(data)

		return boards

					 
dataset = ParquetChessDataset(path="./parquet_data")

dataloader = DataLoader(  
    dataset,  
    batch_size=64,  
    shuffle=True,  
    num_workers=1,  
    prefetch_factor=2,  
    persistent_workers=True  
)
```

With this simple setting, I achieve a throughput of ~ 400 samples/second on my M3 Pro. 
