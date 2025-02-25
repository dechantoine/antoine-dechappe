---
title: Build a chess dataset from PGNs
draft: false
tags: 
date: 2025-02-25
---
Chess is a game of strategy, but it’s also a game rich in data. If you’re interested in training a neural network to analyze chess games, you’ll need a dataset—and PGN (Portable Game Notation) files are the standard format for storing and exchanging chess games. In this guide, we’ll build a PyTorch dataset that reads PGN files and extracts necessary information for training ML models.

# What is a PGN File?

PGN files store chess games in a human-readable format. Here’s an example of a PGN file from [Wikipedia](https://en.wikipedia.org/wiki/Portable_Game_Notation):

```
[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5 Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6 23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5 hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5 35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6 Nf2 42.g4 Bd3 43.Re6 1/2-1/2
```

Each game consists of metadata (players, event details, etc.), the sequence of moves and end with the result of the game.

# Designing the Dataset Class

To create a PyTorch dataset, we’ll define an abstract base class that ensures consistency across different chess dataset backends. This dataset should:
- Have a length corresponding to the total number of moves in all PGN files.
- Allow retrieval of the game winner and move count if needed.
- Inherit from `torch.utils.data.Dataset` for seamless integration with PyTorch’s `DataLoader`.
- Implement `__getitem__` and `__getitems__` methods to fetch individual positions efficiently.
- Return board states as tensors, including the board position, active color, and castling rights.

```python
from abc import ABC  
from typing import Optional, Union  
  
from pydantic import BaseModel  
from torch import Tensor  
from torch.utils.data import Dataset  
  
  
class BoardItem(BaseModel):  
    board: Tensor  
    active_color: Tensor  
    castling: Tensor  
    winner: Optional[Tensor] = None  
    move_id: Optional[Tensor] = None  
    total_moves: Optional[Tensor] = None  
  
    class Config:  
        arbitrary_types_allowed = True  
  
  
class BaseChessDataset(ABC, Dataset):  
    def __init__(self,  
                 winner: bool = False,  
                 move_count: bool = False):  
	    """Initializes the BaseChessDataset class.  
  
	    Args:        
			winner (bool): Whether to include winner in outputs.
			move_count (bool): Whether to include move count in outputs.  
	    """
        self.winner = winner  
        self.move_count = move_count  
  
    def __len__(self) -> int:  
        """Returns the length of the dataset."""  
        pass  
  
    def __getitem__(self, idx: Union[Tensor, int]) -> BoardItem:  
        """Returns the item at the given index."""  
        pass  
  
    def __getitems__(self, indices: Union[Tensor, list[int]]) -> BoardItem:  
        """Returns the items at the given indices."""  
        pass
 ```

# Implementing the PGN Dataset

Now, let’s create a dataset class that reads PGN files on the fly:
- It first scans all PGN files to count moves and store file-game-move triplets.
- When retrieving a move, it loads the corresponding PGN file and extracts the board state.

```python
import os  
from typing import Union  
  
import chess.pgn  
import numpy as np  
import torch  
from torch import Tensor  
  
from src.data.base_dataset import BaseChessDataset, BoardItem  
from src.data.data_utils import batch_boards_to_tensor, board_to_tensor, result_to_tensor  
  
  
class PGNDataset(BaseChessDataset):  
    """Torch dataset build upon PGN files."""  
  
    def __init__(  
            self,  
            root_dir: str,  
            winner: bool = False,  
            move_count: bool = False  
    ) -> None:  
        """Initializes the PGNDataset class.  
        Args:
	        root_dir (string): Directory with all the PGNs.
			winner (bool): Whether to include winner in outputs.
			move_count (bool): Whether to include move count in outputs.
		"""
		super().__init__(
			winner=winner,
			move_count=move_count
		)  
  
        self.root_dir = root_dir  
        self.list_pgn_files = [  
            f for f in os.listdir(self.root_dir) if f.endswith(".pgn")  
        ]
        self.list_pgn_files.sort()
        self.board_indices = self.get_boards_indices()  
  
    def get_boards_indices(  
            self, 
    ) -> list[tuple[int, int, int]]:  
        """Get the indices of all the boards in the dataset.
        Returns: 
	        list[tuple[int, int, int]]: List of tuples containing the file index, game index, and move index  
        """
        list_board_indices = []  
        for i, file in enumerate(self.list_pgn_files):  
            pgn = open(os.path.join(self.root_dir, file))
            j = -1  
  
            while True:  
                game = chess.pgn.read_game(pgn)  
                if game is None:  
                    break  
                j += 1  
  
                try:  
                    result = result_to_tensor(game.headers["Result"])  
                except ValueError:  
                    continue  
                else:  
	                n_moves = len(list(game.mainline_moves()))
                    list_board_indices.extend([
	                    (i, j, k) 
                        for k in range(1,n_moves+1)
                        ]  
                    )  
  
        return list_board_indices  
  
    def retrieve_board(self, idx: int) -> (chess.Board, int, int, int):  
        """Retrieve the board at the given index of the dataset from files.  
  
        Args:
			idx (int): Index of the board to retrieve.  
        Returns:
			board (chess.Board): The board at the given index.
			move_id (int): The index of the move in the game.
			total_moves (int): The total number of moves in the game.
			result (int): The result of the game.  
        """
		file_id, game_id, move_id = self.board_indices[idx]  
        file = self.list_pgn_files[file_id]  
        pgn = open(os.path.join(self.root_dir, file))
  
        for j in range(game_id):  
            chess.pgn.skip_game(pgn)  
        game = chess.pgn.read_game(pgn)  
  
        result = int(result_to_tensor(game.headers["Result"])[0])  
        board = game.board()  
        mainline = list(game.mainline_moves())  
        for move in mainline[:move_id]:  
            board.push(move)
        return board, (move_id // 2) + 1, (len(mainline) // 2) + 1, result  
  
    def __len__(self) -> int:  
        return len(self.board_indices)  
  
    def __getitem__(self, idx: Union[Tensor, int]) -> BoardItem:  
        if torch.is_tensor(idx):  
            idx = int(idx.item())  
  
		board_sample, move_id, total_moves, winner = self.retrieve_board(
			idx=idx
		)  
        board_array, active_color, castling = board_to_tensor(
	        board=board_sample
        )  
  
        board_sample = torch.tensor(board_array)  
        active_color = torch.tensor(active_color)  
        castling = torch.tensor(castling)  
  
        if self.winner:  
            winner = torch.tensor([winner])  
  
        if self.move_count:  
            move_id = torch.tensor([move_id])  
            total_moves = torch.tensor([total_moves])  
  
        return BoardItem(  
            board=board_sample,  
            active_color=active_color,  
            castling=castling,  
            winner=winner if self.winner else None,  
            move_id=move_id if self.move_count else None,  
            total_moves=total_moves if self.move_count else None  
        )  
  
    def __getitems__(self, indices: Union[Tensor, list[int]]):  
        if torch.is_tensor(indices):  
            indices = indices.int().tolist()  
  
        board_samples, move_ids, totals_moves, winners = zip(  
            *[self.retrieve_board(idx=i) for i in indices]  
        )  
  
        board_samples, active_colors, castlings = batch_boards_to_tensor(  
            batch_boards=board_samples  
        )  
  
        if self.winner:  
            winners = torch.tensor([[w] for w in winners])  
  
        if self.move_count:  
            move_ids = torch.tensor([[m] for m in move_ids])  
            totals_moves = torch.tensor([[t] for t in totals_moves])  
  
        return BoardItem(  
            board=board_samples,  
            active_color=active_colors,  
            castling=castlings,  
            winner=winners if self.winner else None,  
            move_id=move_ids if self.move_count else None,  
            total_moves=totals_moves if self.move_count else None  
        )
```

# Conclusion

While this dataset implementation provides a functional way to extract chess positions from PGN files, it has several inefficiencies: 
- The repeated file opening and lack of caching may lead to performance bottlenecks, particularly for large datasets. 
- Additionally, the dataset currently lacks parallel processing, which could significantly improve speed. 

In the next article, we will benchmark its performance and explore optimizations to improve efficiency.