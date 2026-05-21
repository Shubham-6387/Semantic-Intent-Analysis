#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/netanim-module.h"
#include "ns3/mobility-module.h"
#include "ns3/flow-monitor-module.h"
#include "ns3/error-model.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("NetflixCDN50Users");

int
main(int argc, char *argv[])
{
    std::string dataRate = "20Mbps";
    std::string delay = "5ms";
    std::string errorRateStr = "0.01";
    std::string queueSizeStr = "1000p";
    std::string bitrateStr = "1Mbps";
    
    CommandLine cmd;
    cmd.AddValue("dataRate", "Data rate for the links", dataRate);
    cmd.AddValue("delay", "Delay for the links", delay);
    cmd.AddValue("errorRate", "Packet drop error rate", errorRateStr);
    cmd.AddValue("queueSize", "Queue size (packets)", queueSizeStr);
    cmd.AddValue("bitrate", "Streaming bitrate", bitrateStr);
    cmd.Parse(argc, argv);

    double errorRate = std::stod(errorRateStr);

    // -----------------------------
    // CREATE NODES
    // -----------------------------
    NodeContainer authServer;
    authServer.Create(1);

    NodeContainer loadBalancer;
    loadBalancer.Create(1);

    NodeContainer cdnServers;
    cdnServers.Create(2);

    NodeContainer routers;
    routers.Create(2);

    NodeContainer users;
    users.Create(50);

    // -----------------------------
    // MOBILITY
    // -----------------------------
    MobilityHelper mobility;
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(authServer);
    mobility.Install(loadBalancer);
    mobility.Install(cdnServers);
    mobility.Install(routers);
    mobility.Install(users);

    // -----------------------------
    // LINK CONFIGURATION
    // -----------------------------
    PointToPointHelper p2p;
    p2p.SetDeviceAttribute("DataRate", StringValue(dataRate));
    p2p.SetChannelAttribute("Delay", StringValue(delay));
    p2p.SetQueue("ns3::DropTailQueue", "MaxSize", StringValue(queueSizeStr));

    // -----------------------------
    // CORE CONNECTIONS
    // -----------------------------
    NetDeviceContainer d1 = p2p.Install(authServer.Get(0), loadBalancer.Get(0));
    NetDeviceContainer d2 = p2p.Install(loadBalancer.Get(0), cdnServers.Get(0));
    NetDeviceContainer d3 = p2p.Install(loadBalancer.Get(0), cdnServers.Get(1));
    NetDeviceContainer d4 = p2p.Install(cdnServers.Get(0), routers.Get(0));
    NetDeviceContainer d5 = p2p.Install(cdnServers.Get(1), routers.Get(1));

    // -----------------------------
    // USER CONNECTIONS
    // -----------------------------
    std::vector<NetDeviceContainer> userDevices;
    for (uint32_t i = 0; i < 25; i++)
    {
        userDevices.push_back(p2p.Install(routers.Get(0), users.Get(i)));
    }
    for (uint32_t i = 25; i < 50; i++)
    {
        userDevices.push_back(p2p.Install(routers.Get(1), users.Get(i)));
    }

    // -----------------------------
    // ERROR MODEL
    // -----------------------------
    Ptr<RateErrorModel> em = CreateObject<RateErrorModel>();
    em->SetAttribute("ErrorRate", DoubleValue(errorRate));
    for (uint32_t i = 0; i < 50; i++)
    {
        userDevices[i].Get(1)->SetAttribute("ReceiveErrorModel", PointerValue(em));
    }

    // -----------------------------
    // INTERNET STACK
    // -----------------------------
    InternetStackHelper stack;
    stack.Install(authServer);
    stack.Install(loadBalancer);
    stack.Install(cdnServers);
    stack.Install(routers);
    stack.Install(users);

    // -----------------------------
    // IP ASSIGNMENT
    // -----------------------------
    Ipv4AddressHelper address;
    address.SetBase("10.1.1.0", "255.255.255.0");
    address.Assign(d1);

    address.SetBase("10.1.2.0", "255.255.255.0");
    address.Assign(d2);

    address.SetBase("10.1.3.0", "255.255.255.0");
    address.Assign(d3);

    address.SetBase("10.1.4.0", "255.255.255.0");
    address.Assign(d4);

    address.SetBase("10.1.5.0", "255.255.255.0");
    address.Assign(d5);

    // -----------------------------
    // USER SUBNETS
    // -----------------------------
    std::vector<Ipv4InterfaceContainer> userInterfaces;
    for (uint32_t i = 0; i < 50; i++)
    {
        std::ostringstream subnet;
        subnet << "10.1." << (i + 10) << ".0";
        address.SetBase(subnet.str().c_str(), "255.255.255.0");
        userInterfaces.push_back(address.Assign(userDevices[i]));
    }

    // -----------------------------
    // ROUTING
    // -----------------------------
    Ipv4GlobalRoutingHelper::PopulateRoutingTables();

    // -----------------------------
    // TRAFFIC
    // -----------------------------
    uint16_t port = 9;

    // Packet sinks
    for (uint32_t i = 0; i < 50; i++)
    {
        PacketSinkHelper sinkHelper("ns3::UdpSocketFactory", InetSocketAddress(Ipv4Address::GetAny(), port));
        ApplicationContainer sinkApp = sinkHelper.Install(users.Get(i));
        sinkApp.Start(Seconds(0.0));
        sinkApp.Stop(Seconds(10.0));
    }

    // Video traffic
    for (uint32_t i = 0; i < 50; i++)
    {
        OnOffHelper videoTraffic("ns3::UdpSocketFactory", InetSocketAddress(userInterfaces[i].GetAddress(1), port));
        videoTraffic.SetAttribute("DataRate", StringValue(bitrateStr));
        videoTraffic.SetAttribute("PacketSize", UintegerValue(1024));

        ApplicationContainer senderApp;
        if (i < 25)
        {
            senderApp = videoTraffic.Install(cdnServers.Get(0));
        }
        else
        {
            senderApp = videoTraffic.Install(cdnServers.Get(1));
        }
        senderApp.Start(Seconds(1.0 + i * 0.1));
        senderApp.Stop(Seconds(10.0));
    }

    // -----------------------------
    // FLOWMONITOR
    // -----------------------------
    FlowMonitorHelper flowmonHelper;
    Ptr<FlowMonitor> flowmon = flowmonHelper.InstallAll();

    // -----------------------------
    // NETANIM
    // -----------------------------
    AnimationInterface anim("netflix50.xml");
    anim.SetMaxPktsPerTraceFile(500000);

    // Positions
    anim.SetConstantPosition(authServer.Get(0), 10, 50);
    anim.UpdateNodeDescription(authServer.Get(0), "AuthServer");
    anim.SetConstantPosition(loadBalancer.Get(0), 30, 50);
    anim.UpdateNodeDescription(loadBalancer.Get(0), "LoadBalancer");
    anim.SetConstantPosition(cdnServers.Get(0), 50, 70);
    anim.UpdateNodeDescription(cdnServers.Get(0), "CDN1");
    anim.SetConstantPosition(cdnServers.Get(1), 50, 30);
    anim.UpdateNodeDescription(cdnServers.Get(1), "CDN2");
    anim.SetConstantPosition(routers.Get(0), 70, 70);
    anim.UpdateNodeDescription(routers.Get(0), "Router1");
    anim.SetConstantPosition(routers.Get(1), 70, 30);
    anim.UpdateNodeDescription(routers.Get(1), "Router2");

    for (uint32_t i = 0; i < 25; i++)
    {
        anim.SetConstantPosition(users.Get(i), 100, 5 + i * 3);
        std::ostringstream name;
        name << "U" << i;
        anim.UpdateNodeDescription(users.Get(i), name.str());
    }

    for (uint32_t i = 25; i < 50; i++)
    {
        anim.SetConstantPosition(users.Get(i), 130, 5 + (i - 25) * 3);
        std::ostringstream name;
        name << "U" << i;
        anim.UpdateNodeDescription(users.Get(i), name.str());
    }

    // -----------------------------
    // RUN
    // -----------------------------
    Simulator::Stop(Seconds(10.0));
    NS_LOG_UNCOND("Netflix CDN Topology with 50 Users Running...");
    Simulator::Run();

    flowmon->SerializeToXmlFile("flowmon.xml", true, true);

    Simulator::Destroy();
    return 0;
}
