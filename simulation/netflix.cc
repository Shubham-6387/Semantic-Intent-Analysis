#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/flow-monitor-module.h"
#include "ns3/error-model.h"
#include "ns3/netanim-module.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE ("NetflixOptimization");

int main (int argc, char *argv[])
{
  std::string dataRate = "10Mbps";
  std::string delay = "15ms";
  std::string errorRateStr = "0.01";
  std::string queueSizeStr = "1000p";
  std::string bitrateStr = "5Mbps";
  
  CommandLine cmd;
  cmd.AddValue ("dataRate", "Data rate for the links", dataRate);
  cmd.AddValue ("delay", "Delay for the links", delay);
  cmd.AddValue ("errorRate", "Packet drop error rate", errorRateStr);
  cmd.AddValue ("queueSize", "Queue size (packets)", queueSizeStr);
  cmd.AddValue ("bitrate", "Streaming bitrate", bitrateStr);
  cmd.Parse (argc, argv);

  double errorRate = std::stod(errorRateStr);

  NS_LOG_INFO ("Simulating Netflix Architecture");

  // 1. Create Nodes
  NodeContainer authServer, loadBalancer, cdns, routers, users;
  authServer.Create(1);
  loadBalancer.Create(1);
  cdns.Create(2);
  routers.Create(2);
  users.Create(4);

  // 2. Setup Point-to-Point Links with Queue and Error Models
  PointToPointHelper p2p;
  p2p.SetDeviceAttribute ("DataRate", StringValue (dataRate));
  p2p.SetChannelAttribute ("Delay", StringValue (delay));
  p2p.SetQueue ("ns3::DropTailQueue", "MaxSize", StringValue (queueSizeStr));

  // Connect Auth Server to Load Balancer
  NetDeviceContainer d_auth_lb = p2p.Install (authServer.Get(0), loadBalancer.Get(0));

  // Connect Load Balancer to CDNs
  NetDeviceContainer d_lb_cdn1 = p2p.Install (loadBalancer.Get(0), cdns.Get(0));
  NetDeviceContainer d_lb_cdn2 = p2p.Install (loadBalancer.Get(0), cdns.Get(1));

  // Connect CDNs to Routers
  NetDeviceContainer d_cdn1_router1 = p2p.Install (cdns.Get(0), routers.Get(0));
  NetDeviceContainer d_cdn2_router2 = p2p.Install (cdns.Get(1), routers.Get(1));

  // Connect Routers to Users
  NetDeviceContainer d_router1_u1 = p2p.Install (routers.Get(0), users.Get(0));
  NetDeviceContainer d_router1_u2 = p2p.Install (routers.Get(0), users.Get(1));
  NetDeviceContainer d_router2_u3 = p2p.Install (routers.Get(1), users.Get(2));
  NetDeviceContainer d_router2_u4 = p2p.Install (routers.Get(1), users.Get(3));

  // Add Rate Error Model to simulate packet loss
  Ptr<RateErrorModel> em = CreateObject<RateErrorModel> ();
  em->SetAttribute ("ErrorRate", DoubleValue (errorRate));
  d_router1_u1.Get (1)->SetAttribute ("ReceiveErrorModel", PointerValue (em));
  d_router1_u2.Get (1)->SetAttribute ("ReceiveErrorModel", PointerValue (em));
  d_router2_u3.Get (1)->SetAttribute ("ReceiveErrorModel", PointerValue (em));
  d_router2_u4.Get (1)->SetAttribute ("ReceiveErrorModel", PointerValue (em));

  // 3. Install Internet Stack
  InternetStackHelper stack;
  stack.Install (authServer);
  stack.Install (loadBalancer);
  stack.Install (cdns);
  stack.Install (routers);
  stack.Install (users);

  // 4. Assign IP Addresses
  Ipv4AddressHelper address;
  
  address.SetBase ("10.1.1.0", "255.255.255.0");
  address.Assign (d_auth_lb);

  address.SetBase ("10.1.2.0", "255.255.255.0");
  address.Assign (d_lb_cdn1);

  address.SetBase ("10.1.3.0", "255.255.255.0");
  address.Assign (d_lb_cdn2);

  address.SetBase ("10.1.4.0", "255.255.255.0");
  address.Assign (d_cdn1_router1);

  address.SetBase ("10.1.5.0", "255.255.255.0");
  address.Assign (d_cdn2_router2);

  address.SetBase ("10.1.6.0", "255.255.255.0");
  Ipv4InterfaceContainer i_r1_u1 = address.Assign (d_router1_u1);
  Ipv4InterfaceContainer i_r1_u2 = address.Assign (d_router1_u2);

  address.SetBase ("10.1.7.0", "255.255.255.0");
  Ipv4InterfaceContainer i_r2_u3 = address.Assign (d_router2_u3);
  Ipv4InterfaceContainer i_r2_u4 = address.Assign (d_router2_u4);

  // 5. Setup Applications (Video Streaming simulation via UDP OnOffHelper)
  uint16_t port = 9;

  // CDN1 streams to User1
  OnOffHelper onoff1 ("ns3::UdpSocketFactory", Address (InetSocketAddress (i_r1_u1.GetAddress(1), port)));
  onoff1.SetAttribute ("DataRate", StringValue (bitrateStr));
  onoff1.SetAttribute ("PacketSize", UintegerValue (1024));
  
  ApplicationContainer apps1 = onoff1.Install (cdns.Get(0));
  apps1.Start (Seconds (1.0));
  apps1.Stop (Seconds (10.0));

  // Packet Sink for User 1
  PacketSinkHelper sink1 ("ns3::UdpSocketFactory", Address (InetSocketAddress (Ipv4Address::GetAny(), port)));
  ApplicationContainer sinkApps1 = sink1.Install (users.Get(0));
  sinkApps1.Start (Seconds (0.0));
  sinkApps1.Stop (Seconds (10.0));

  // 6. Setup Routing
  Ipv4GlobalRoutingHelper::PopulateRoutingTables ();

  // 7. Setup FlowMonitor
  FlowMonitorHelper flowmonHelper;
  Ptr<FlowMonitor> flowmon = flowmonHelper.InstallAll ();

  // 8. NetAnim
  AnimationInterface anim("netflix.xml");
  anim.SetConstantPosition(authServer.Get(0), 50.0, 10.0);
  anim.SetConstantPosition(loadBalancer.Get(0), 50.0, 30.0);
  anim.SetConstantPosition(cdns.Get(0), 20.0, 50.0);
  anim.SetConstantPosition(cdns.Get(1), 80.0, 50.0);
  anim.SetConstantPosition(routers.Get(0), 20.0, 70.0);
  anim.SetConstantPosition(routers.Get(1), 80.0, 70.0);
  anim.SetConstantPosition(users.Get(0), 10.0, 90.0);
  anim.SetConstantPosition(users.Get(1), 30.0, 90.0);
  anim.SetConstantPosition(users.Get(2), 70.0, 90.0);
  anim.SetConstantPosition(users.Get(3), 90.0, 90.0);

  // 9. Run Simulation
  Simulator::Stop (Seconds (10.0));
  Simulator::Run ();

  // 10. Export Metrics
  flowmon->SerializeToXmlFile("flowmon.xml", true, true);

  Simulator::Destroy ();
  return 0;
}
