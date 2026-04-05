'use client'

export default function Profile() {
  return (
    <div className="p-6 text-white space-y-6">

      <h1 className="text-2xl font-bold">Owner Profile</h1>

      <div className="bg-dark-card p-4 rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">Personal Info</h2>
        <p><strong>Name:</strong> Mariam Ahmed</p>
        <p><strong>Email:</strong> mariam@email.com</p>
        <p><strong>Role:</strong> Station Owner</p>
      </div>

      <div className="bg-dark-card p-4 rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">System Overview</h2>
        <p><strong>Chargers:</strong> 6</p>
        <p><strong>Active Slots:</strong> 3</p>
        <p><strong>Total Energy Today:</strong> 120 kWh</p>
      </div>

      <div className="bg-dark-card p-4 rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">Business Info</h2>
        <p><strong>Station:</strong> Smart EV Station</p>
        <p><strong>Revenue Today:</strong> 850 EGP</p>
      </div>

    </div>
  )
}