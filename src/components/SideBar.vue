<template>
  <b-navbar-nav
    class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
    id="accordionSidebar"
  >
    <b-nav-item to="/">
      <i class="fas fa-fw fa-home"></i>
      <span>Dashboard</span>
    </b-nav-item>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <!-- Heading -->
    <div class="sidebar-heading">Merchant</div>

    <b-nav-item
      class="nav-link collapsed"
      to="/"
      data-toggle="collapse"
      data-target="#collapseProducts"
      aria-expanded="true"
      aria-controls="collapseProducts"
    >
      <i class="fas fa-fw fa-ticket-alt"></i>
      <span>Products</span>
      <div
        id="collapseProducts"
        class="collapse"
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <b-nav-item to="/attraction" class="collapse-item">Attraction</b-nav-item>
          <b-nav-item to="/ferry" class="collapse-item">Ferry</b-nav-item>
          <b-nav-item to="/hotel" class="collapse-item">Hotel</b-nav-item>
          <b-nav-item to="/other" class="collapse-item">Other</b-nav-item>
        </div>
      </div>
    </b-nav-item>

    <b-nav-item>
      <i class="fas fa-fw fa-sticky-note"></i>
      <span>Orders</span>
    </b-nav-item>

    <b-nav-item
      class="nav-link collapsed"
      data-toggle="collapse"
      data-target="#collapseInventory"
      aria-expanded="true"
      aria-controls="collapseInventory"
    >
      <i class="fas fa-fw fa-sticky-note"></i>
      <span>Room Inventory</span>
      <div
        id="collapseInventory"
        class="collapse"
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <b-nav-item to="/view-inventory" class="collapse-item">View Inventory</b-nav-item>
          <b-nav-item to="/create-inventory" class="collapse-item">Create Inventory</b-nav-item>
        </div>
      </div>
    </b-nav-item>

    <b-nav-item
      class="nav-link collapsed"
      href="#"
      data-toggle="collapse"
      data-target="#collapseTopUp"
      aria-expanded="true"
      aria-controls="collapseTopUp"
    >
      <i class="fas fa-fw fa-credit-card"></i>
      <span>Top Up</span>
      <div
        id="collapseTopUp"
        class="collapse"
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <b-nav-item class="collapse-item">Add Credit</b-nav-item>
          <b-nav-item class="collapse-item">Credit Status</b-nav-item>
        </div>
      </div>
    </b-nav-item>

    <b-nav-item>
      <i class="fas fa-fw fa-chart-area"></i>
      <span>Reports</span>
    </b-nav-item>

    <hr class="sidebar-divider d-none d-md-block" />

    <div class="text-center d-none d-md-inline">
      <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>
  </b-navbar-nav>
</template>

<script>
export default {};
</script>

<style>
</style>