import {
  Approval as ApprovalEvent,
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
  Transfer1 as Transfer1Event
} from "../generated/L2ArbitrumToken/L2ArbitrumToken"
import {
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  Initialized,
  Delegate,
  OwnershipTransferred,
  Transfer,
  Transfer1
} from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let toDelegate = Delegate.load(event.params.toDelegate.toHexString())

  let entity = new DelegateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
  )
  entity.delegator = event.params.delegator
  entity.fromDelegate = event.params.fromDelegate
  entity.toDelegate = event.params.toDelegate
  if (toDelegate != null) {
    entity.newBalance = toDelegate.latestBalance
    entity.balanceBlockTimestamp = toDelegate.blockTimestamp
  } else {
    entity.newBalance = BigInt.fromI32(0) // Default value if no balance found
    entity.balanceBlockTimestamp =BigInt.fromI32(0) // Default value if no balance found 
  }  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateVotesChanged(
  event: DelegateVotesChangedEvent
): void {
  let delegateId = event.params.delegate.toHexString()
  
  // Create or update the Delegate entity
  let delegate = Delegate.load(delegateId)
  if (delegate == null) {
    delegate = new Delegate(delegateId)
  }
  
  // Update the balance
  delegate.latestBalance = event.params.newBalance
  delegate.blockTimestamp = event.block.timestamp
  delegate.save();
  let entity = new DelegateVotesChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegate = event.params.delegate
  entity.previousBalance = event.params.previousBalance
  entity.newBalance = event.params.newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer1(event: Transfer1Event): void {
  let entity = new Transfer1(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
