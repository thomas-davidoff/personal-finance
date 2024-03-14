"""added account starting balance

Revision ID: 8312a993f02b
Revises: f0eac4097ace
Create Date: 2024-01-24 07:29:27.026926

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8312a993f02b'
down_revision: Union[str, None] = 'f0eac4097ace'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('account', sa.Column('starting_balance', sa.Float(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('account', 'starting_balance')
    # ### end Alembic commands ###
