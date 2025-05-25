import { useState } from 'react'
import AddAddressForm from './AddAddressForm'
import ListAddresses from './ListAddress'

const Address = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [addressId, setAddressId] = useState(null)

  const handleEditAddressClick = (id) => {
    setIsAddingAddress(true)
    setIsEditingAddress(true)
    setAddressId(id)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Address</h3>
        {isAddingAddress ? (
          <button
            className="btn bg-white font-normal"
            onClick={() => {
              setIsAddingAddress(false)
              setIsEditingAddress(false)
              setAddressId(null)
            }}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn bg-white font-normal"
            onClick={() => setIsAddingAddress(true)}
          >
            Add
          </button>
        )}
      </div>

      <hr className="my-4 text-gray-400" />

      {isAddingAddress ? (
        <AddAddressForm
          setIsAddingAddress={setIsAddingAddress}
          isEditing={isEditingAddress}
          setIsEditing={setIsEditingAddress}
          addressId={addressId}
        />
      ) : (
        <ListAddresses handleEditAddressClick={handleEditAddressClick} />
      )}
    </div>
  )
}

export default Address
